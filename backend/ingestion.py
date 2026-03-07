import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, TextLoader, CSVLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
from pinecone import Pinecone, ServerlessSpec
from pdf2image import convert_from_path
from PIL import Image
import pytesseract
import io
import uuid
import time
import os

load_dotenv()
TESSERACT_CMD = os.getenv("TESSERACT_CMD", "").strip()
if TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD
else:
    # Auto-detect common Windows installation paths to reduce setup friction.
    default_windows_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    ]
    for candidate in default_windows_paths:
        if os.path.exists(candidate):
            pytesseract.pytesseract.tesseract_cmd = candidate
            break

# Initialize Pinecone
try:
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
except Exception as e:
    print(f"Warning: Could not initialize Pinecone: {e}")
    pc = None

from utils import sanitize_index_name

OCR_UNAVAILABLE_MARKER = "OCR unavailable"
IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg")


def create_pinecone_index(user):
    if pc is None:
        raise RuntimeError("Pinecone client not initialized. Set PINECONE_API_KEY in your .env.")

    name = sanitize_index_name(user)

    existing_indexes = []
    try:
        existing_indexes = pc.list_indexes().names()
    except Exception:
        existing_indexes = []

    if name not in existing_indexes:
        print(f"Creating Pinecone index '{name}'...")
        pc.create_index(
            name=name,
            dimension=384,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )

    # wait until index is ready (with timeout to prevent hanging)
    max_wait = 60  # seconds
    waited = 0
    interval = 1
    ready = False
    
    while waited < max_wait:
        try:
            desc = pc.describe_index(name)
            
            # Handle different status formats from Pinecone SDK
            if desc is None:
                ready = False
            else:
                status_attr = getattr(desc, "status", None)
                if isinstance(status_attr, dict):
                    ready = bool(status_attr.get("ready", False))
                elif hasattr(status_attr, "get"):
                    # dict-like object
                    ready = bool(status_attr.get("ready", False))
                elif hasattr(status_attr, "ready"):
                    # object with ready attribute
                    ready = bool(getattr(status_attr, "ready", False))
                else:
                    # fallback: assume not ready
                    ready = False
            
            if ready:
                print(f"Index '{name}' is ready")
                break
                
        except Exception as e:
            print(f"Warning: error checking index status: {e}")
            ready = False
        
        time.sleep(interval)
        waited += interval
    
    if not ready:
        raise TimeoutError(f"Pinecone index '{name}' not ready after {max_wait} seconds")
    
    return name


def extract_images_from_pdf(pdf_path, output_folder="extracted_images"):
    """Extract images from a PDF and save them as separate files."""
    os.makedirs(output_folder, exist_ok=True)
    images = convert_from_path(pdf_path)
    image_paths = []
    
    for i, image in enumerate(images):
        image_path = os.path.join(output_folder, f"{os.path.basename(pdf_path)}_image_{i}.png")
        image.save(image_path, "PNG")
        image_paths.append(image_path)
    
    return image_paths

def extract_text_from_image(image_path):
    """Extract text from an image using OCR. Returns empty string if tesseract unavailable."""
    try:
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text.strip()
    except pytesseract.TesseractNotFoundError as e:
        print(f"Warning: Tesseract not found: {e}")
        return ""
    except Exception as e:
        print(f"Warning: Could not extract text from image (tesseract may not be installed): {e}")
        # Return empty content so we don't index non-informational placeholders.
        return ""

def load_document(file_path):
    """Load a document from file."""
    try:
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
            text_data = loader.load()
            image_paths = extract_images_from_pdf(file_path)
            return text_data, image_paths
        elif file_path.endswith(".txt"):
            loader = TextLoader(file_path)
        elif file_path.endswith(".csv"):
            loader = CSVLoader(file_path)
        elif file_path.endswith((".mp3", ".wav")):
            return transcribe_audio(file_path), []
        elif file_path.endswith(IMAGE_EXTENSIONS):
            return [Document(page_content=extract_text_from_image(file_path))], []
        else:
            raise ValueError("Unsupported file format")
        return loader.load(), []
    except Exception as e:
        print(f"Error loading document: {e}")
        return [], []

def transcribe_audio(file_path):
    """Transcribe audio file into text using SpeechRecognition."""
    try:
        import speech_recognition as sr
        recognizer = sr.Recognizer()
        with sr.AudioFile(file_path) as source:
            audio = recognizer.record(source)
        text = recognizer.recognize_google(audio)
        return [Document(page_content=text)]
    except ImportError:
        print("speech_recognition module not available. Please install it to enable audio transcription.")
        return []
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return []

def split_text(document, chunk_size=1000, chunk_overlap=100):
    """Split document into smaller chunks."""
    try:
        text_splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        return text_splitter.split_documents(document)
    except Exception as e:
        print(f"Error splitting text: {e}")
        return []

def create_embeddings():
    """Create an embedding model. Uses local Hugging Face embeddings for better performance."""
    try:
        return HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
    except Exception as e:
        print(f"Error creating embeddings: {e}")
        return None

def store_embeddings(texts, embeddings, user, collection, file_path):
    """Store embeddings in Pinecone with filename and unique ID in metadata."""
    index_name = sanitize_index_name(user)
    try:
        # Add filename and unique ID to metadata for each document
        for doc in texts:
            if not hasattr(doc, 'metadata'):
                doc.metadata = {}
            doc.metadata['filename'] = os.path.basename(file_path)
            doc.metadata['vector_id'] = str(uuid.uuid4())  # Unique ID for each vector
            
        vector_store = PineconeVectorStore.from_documents(
            texts, 
            embeddings, 
            index_name=index_name, 
            namespace=collection
        )
        print(f"Stored {len(texts)} embeddings in Pinecone index '{index_name}' under namespace '{collection}'")
        return [doc.metadata['vector_id'] for doc in texts]  # Return list of vector IDs
    except Exception as e:
        print(f"Error storing embeddings: {e}")
        return []
    
def ingest_file(file_path, user, collection):
    """Process and store a file's data in Pinecone."""
    try:
        create_pinecone_index(user)

        # Process file
        document, image_paths = load_document(file_path)
        if not document:
            return False, "Failed to load document"

        is_image_upload = file_path.lower().endswith(IMAGE_EXTENSIONS)
        texts = document if is_image_upload else split_text(document)
        # Keep only meaningful chunks; avoid indexing empty/noise text.
        texts = [
            doc for doc in texts
            if getattr(doc, "page_content", "").strip()
            and OCR_UNAVAILABLE_MARKER.lower() not in getattr(doc, "page_content", "").lower()
        ]
        if not texts:
            if is_image_upload:
                return False, (
                    "No readable text found in image. "
                    "Install/configure Tesseract OCR (or set TESSERACT_CMD in backend .env), "
                    "then re-upload."
                )
            return False, "Failed to split document into chunks"

        print(f"Created {len(texts)} text chunks")

        # Create embeddings
        embeddings = create_embeddings()
        if embeddings is None:
            return False, "Failed to create embeddings"

        # Store text embeddings in Pinecone with filename and IDs
        vector_ids = store_embeddings(texts, embeddings, user, collection, file_path)
        
        # Process images if present
        for image_path in image_paths:
            extracted_text = extract_text_from_image(image_path)
            if not extracted_text.strip():
                print(f"Skipping image '{image_path}' due to empty/unavailable OCR text")
                continue
            image_doc = Document(
                page_content=extracted_text, 
                metadata={
                    "type": "image", 
                    "filename": os.path.basename(image_path),
                    "vector_id": str(uuid.uuid4())
                }
            )
            image_vector_ids = store_embeddings([image_doc], embeddings, user, collection, image_path)
            vector_ids.extend(image_vector_ids)
            print(f"Stored OCR-extracted text from {image_path}")

        os.remove(file_path)
        return True, f"File processed and stored successfully with vector IDs: {vector_ids}"
    except Exception as e:
        print(f"Error ingesting file: {e}")
        return False, f"Error ingesting file: {e}"
