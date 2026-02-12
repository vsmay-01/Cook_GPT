import os
from pinecone import Pinecone
from dotenv import load_dotenv
from utils import sanitize_index_name

load_dotenv()

# Initialize Pinecone
try:
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
except Exception as e:
    print(f"Warning: Could not initialize Pinecone: {e}")
    pc = None

def get_pinecone_index_info(user):
    if pc is None:
        raise RuntimeError("Pinecone client not initialized. Set PINECONE_API_KEY in your .env.")

    index_name = sanitize_index_name(user)
    index = pc.Index(index_name)

    try:
        stats = index.describe_index_stats()
        
        # Convert to dict if it's an object
        if hasattr(stats, "to_dict") and callable(getattr(stats, "to_dict")):
            stats_dict = stats.to_dict()
        elif hasattr(stats, "__dict__"):
            stats_dict = stats.__dict__
        else:
            stats_dict = dict(stats) if isinstance(stats, dict) else {}
        
        # Extract namespaces and convert them to plain dicts
        namespaces = {}
        if "namespaces" in stats_dict:
            raw_namespaces = stats_dict["namespaces"]
            if isinstance(raw_namespaces, dict):
                for ns_name, ns_data in raw_namespaces.items():
                    if hasattr(ns_data, "__dict__"):
                        namespaces[ns_name] = ns_data.__dict__
                    elif isinstance(ns_data, dict):
                        namespaces[ns_name] = ns_data
                    else:
                        namespaces[ns_name] = {}
            stats_dict["namespaces"] = namespaces
        
        return stats_dict
        
    except Exception as e:
        print(f"Error getting index stats: {e}")
        # Return empty structure if error occurs
        return {"namespaces": {}}
  
def delete_file_vectors(user, namespace, filename=None):
    """Delete vectors associated with a specific file or all vectors in a namespace."""
    if pc is None:
        return False, "Pinecone client not initialized. Set PINECONE_API_KEY in your .env."

    index_name = sanitize_index_name(user)
    try:
        index = pc.Index(index_name)
        
        if filename:
            # Delete vectors for a specific file
            response = index.query(
                vector=[0] * 768,  # Dummy vector
                top_k=10000,  # Large enough to get all vectors
                include_metadata=True,
                namespace=namespace
            )
            
            ids_to_delete = []
            for match in response.get('matches', []):
                if 'metadata' in match and match['metadata'].get('filename') == filename:
                    ids_to_delete.append(match['id'])
            
            if ids_to_delete:
                index.delete(ids=ids_to_delete, namespace=namespace)
                return True, f"Deleted {len(ids_to_delete)} vectors for file '{filename}' in namespace '{namespace}'"
            else:
                return False, f"No vectors found for file '{filename}' in namespace '{namespace}'"
        else:
            # Delete all vectors in the namespace
            index.delete(delete_all=True, namespace=namespace)
            return True, f"Deleted all vectors in namespace '{namespace}' for user '{user}'"
            
    except Exception as e:
        print(f"Error deleting vectors: {e}")
        return False, str(e)