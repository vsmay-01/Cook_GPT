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

MAX_RETRIEVER_K = 12
MAX_DOCS_FOR_CONTEXT = 8
MAX_CHARS_PER_DOC = 2000
NON_INFORMATIVE_MARKERS = [
    "ocr unavailable",
    "image:",
]
SUMMARY_KEYWORDS = (
    "summary",
    "summarize",
    "overview",
    "all",
    "entire",
    "whole",
    "full",
)

# ✅ ONE embedding model for EVERYTHING
EMBEDDINGS = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def build_context(docs, query_text):
    lowered_query = query_text.lower()
    summary_mode = any(keyword in lowered_query for keyword in SUMMARY_KEYWORDS)
    max_docs = 12 if summary_mode else MAX_DOCS_FOR_CONTEXT
    max_chars_per_doc = 2500 if summary_mode else MAX_CHARS_PER_DOC

    context_parts = []
    for doc in docs[:max_docs]:
        metadata = getattr(doc, "metadata", {}) or {}
        source_bits = []
        if metadata.get("filename"):
            source_bits.append(f"file={metadata['filename']}")
        if metadata.get("type"):
            source_bits.append(f"type={metadata['type']}")

        source_prefix = f"[{' | '.join(source_bits)}]\n" if source_bits else ""
        context_parts.append(f"{source_prefix}{doc.page_content[:max_chars_per_doc]}")

    return "\n\n".join(context_parts)


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
        k=16 if any(keyword in query_text.lower() for keyword in SUMMARY_KEYWORDS) else MAX_RETRIEVER_K
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

    context = build_context(docs, query_text)

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
For CSV and audio/video transcript questions, synthesize across all retrieved chunks before answering.
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
