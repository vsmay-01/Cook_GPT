import os
import warnings
from dotenv import load_dotenv

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_pinecone import PineconeVectorStore

warnings.filterwarnings("ignore")
load_dotenv()

chat_history = {}

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

MAX_RETRIEVER_K = 6
MAX_DOCS_FOR_CONTEXT = 4
MAX_CHARS_PER_DOC = 1000
NON_INFORMATIVE_MARKERS = [
    "ocr unavailable",
    "image:",
]

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

    # Pinecone similarity scores are higher for better matches (cosine metric),
    # so we sort descending to keep the most relevant chunks first.
    docs_with_score.sort(key=lambda x: x[1], reverse=True)
    docs = [doc for doc, _ in docs_with_score]
    # Ignore retrieval hits that are just OCR failure placeholders or empty text.
    docs = [
        doc for doc in docs
        if doc.page_content.strip()
        and not any(marker in doc.page_content.lower() for marker in NON_INFORMATIVE_MARKERS)
    ]

    context = "\n\n".join(
        doc.page_content[:MAX_CHARS_PER_DOC]
        for doc in docs[:MAX_DOCS_FOR_CONTEXT]
    )

    # If no documents were retrieved, return an explicit message instead
    # of relying on the LLM to say "I don't have enough information." This
    # makes it clear to the caller that the retriever returned zero hits.
    if not context.strip():
        return {
            "query": query_text,
            "retrieved_documents": [],
            "llm_response": (
                "No documents were retrieved from the collection/namespace. "
                "Please verify the file was ingested into the correct user index and collection."
            )
        }

    chat = ChatGroq(
        model=GROQ_MODEL,
        temperature=0,
        groq_api_key=os.getenv("GROQ_API_KEY")
    )

    prompt = f"""
Answer ONLY using the context below.
If the question asks for an overview/summary, provide it from the context.
Only say you don't have enough information when the context truly does not contain the answer.

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
