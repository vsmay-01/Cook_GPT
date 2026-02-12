import os
import warnings
from dotenv import load_dotenv

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_pinecone import PineconeVectorStore

warnings.filterwarnings("ignore")
load_dotenv()

chat_history = {}

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-8b-8192")

MAX_RETRIEVER_K = 2
MAX_DOCS_FOR_CONTEXT = 2
MAX_CHARS_PER_DOC = 1000

# ✅ ONE embedding model for EVERYTHING
EMBEDDINGS = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def query_pinecone(query_text, user_index, collection_name):

    if user_index not in chat_history:
        chat_history[user_index] = {}

    if collection_name not in chat_history[user_index]:
        chat_history[user_index][collection_name] = []

    # Pinecone vector store
    vectorstore = PineconeVectorStore(
        index_name=user_index,
        embedding=EMBEDDINGS,
        namespace=collection_name
    )

    # Retrieve documents
    docs_with_score = vectorstore.similarity_search_with_score(
        query_text,
        k=MAX_RETRIEVER_K
    )

    docs_with_score.sort(key=lambda x: x[1])
    docs = [doc for doc, _ in docs_with_score]

    context = "\n\n".join(
        doc.page_content[:MAX_CHARS_PER_DOC]
        for doc in docs[:MAX_DOCS_FOR_CONTEXT]
    )

    chat = ChatGroq(
        model=GROQ_MODEL,
        temperature=0,
        groq_api_key=os.getenv("GROQ_API_KEY")
    )

    prompt = f"""
Answer ONLY using the context below.
If insufficient, say you don't have enough information.

Context:
{context}

Question:
{query_text}
"""

    response = chat.invoke(prompt)
    answer = response.content if hasattr(response, "content") else str(response)

    chat_history[user_index][collection_name].append(
        (query_text, answer)
    )

    return {
        "query": query_text,
        "retrieved_documents": [
            {
                "content": doc.page_content,
                "metadata": doc.metadata,
                "score": score
            }
            for doc, score in docs_with_score
        ],
        "llm_response": answer
    }
