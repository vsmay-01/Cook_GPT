import os
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

def get_pinecone_index_info(user):
    """Fetch metadata about the user's Pinecone index, including namespaces and total stored vectors."""
    index_name = f"{user}-index"

    try:
        index_stats = pc.Index(index_name).describe_index_stats()
        namespaces = list(index_stats.get("namespaces", {}).keys())

        return {
            "user": user,
            "index_name": index_name,
            "namespaces": namespaces,
            "total_vectors": index_stats.get("total_vector_count", 0),
        }
    except Exception as e:
        print(f"Error fetching index info: {e}")
        return {"error": str(e)}
