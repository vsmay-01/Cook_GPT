import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter
# from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import *

load_dotenv()

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

def create_pinecone_index(user):
    """Create a new Pinecone index for the user if it doesn't exist."""
    index_name = f"{user}-index"
    existing_indexes = pc.list_indexes().names()

    if index_name not in existing_indexes:
        pc.create_index(
            name=index_name,
            dimension=768,
            metric="euclidean",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )

def load_document(file_path):
    """Load a document from file."""
    loader = PyPDFLoader(file_path)
    return loader.load()

def split_text(document, chunk_size=1000, chunk_overlap=100):
    """Split document into smaller chunks."""
    text_splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return text_splitter.split_documents(document)

def create_embeddings():
    """Create an embedding model."""
    return GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))

def store_embeddings(texts, embeddings, user, collection):
    """Store embeddings in the user's Pinecone index under the specified collection."""
    index_name = f"{user}-index"
    vector_store = PineconeVectorStore.from_documents(texts, embeddings, index_name=index_name, namespace=collection)

def ingest_file(file_path, user, collection):
    """Process and store a file's data in Pinecone."""
    try:
        # Ensure the user has a Pinecone index
        create_pinecone_index(user)

        # Process file
        document = load_document(file_path)
        texts = split_text(document)
        print(f"Created {len(texts)} chunks")

        # Create embeddings
        embeddings = create_embeddings()

        # Store embeddings in Pinecone
        store_embeddings(texts, embeddings, user, collection)

        # Remove the temporary file after processing
        os.remove(file_path)

        return True, "File processed and stored successfully"
    except Exception as e:
        return False, str(e)
