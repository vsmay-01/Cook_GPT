import os
import speech_recognition as sr
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, TextLoader, CSVLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.schema import Document
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

def create_pinecone_index(user):
    """Create a new Pinecone index for the user if it doesn't exist."""
    index_name = f"{user}-index"
    
    try:
        existing_indexes = pc.list_indexes().names()
        if index_name not in existing_indexes:
            pc.create_index(
                name=index_name,
                dimension=768,
                metric="euclidean",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
    except Exception as e:
        print(f"Error creating Pinecone index: {e}")

def load_document(file_path):
    """Load a document from file."""
    try:
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith(".txt"):
            loader = TextLoader(file_path)
        elif file_path.endswith(".csv"):
            loader = CSVLoader(file_path)
        elif file_path.endswith((".mp3", ".wav")):
            return transcribe_audio(file_path)
        else:
            raise ValueError("Unsupported file format")
        return loader.load()
    except Exception as e:
        print(f"Error loading document: {e}")
        return []

def transcribe_audio(file_path):
    """Transcribe audio file into text using SpeechRecognition."""
    try:
        recognizer = sr.Recognizer()
        with sr.AudioFile(file_path) as source:
            audio = recognizer.record(source)
        text = recognizer.recognize_google(audio)
        return [Document(page_content=text)]
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
    """Create an embedding model."""
    try:
        return GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004", 
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
    except Exception as e:
        print(f"Error creating embeddings: {e}")
        return None

def store_embeddings(texts, embeddings, user, collection):
    """Store embeddings in the user's Pinecone index under the specified collection."""
    index_name = f"{user}-index"
    try:
        vector_store = PineconeVectorStore.from_documents(texts, embeddings, index_name=index_name, namespace=collection)
        print(f"Stored {len(texts)} embeddings in Pinecone index '{index_name}' under namespace '{collection}'")
    except Exception as e:
        print(f"Error storing embeddings: {e}")

def ingest_file(file_path, user, collection):
    """Process and store a file's data in Pinecone."""
    try:
        # Ensure the user has a Pinecone index
        create_pinecone_index(user)

        # Process file
        document = load_document(file_path)
        if not document:
            return False, "Failed to load document"

        texts = split_text(document)
        if not texts:
            return False, "Failed to split document into chunks"

        print(f"Created {len(texts)} chunks")

        # Create embeddings
        embeddings = create_embeddings()
        if embeddings is None:
            return False, "Failed to create embeddings"

        # Store embeddings in Pinecone
        store_embeddings(texts, embeddings, user, collection)

        # Remove the temporary file after processing
        os.remove(file_path)

        return True, "File processed and stored successfully"
    except Exception as e:
        return False, f"Error processing file: {e}"