import os
import warnings
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import ConversationalRetrievalChain
from langchain_pinecone import PineconeVectorStore
from langchain.prompts import PromptTemplate

warnings.filterwarnings("ignore")
load_dotenv()

chat_history = {}

def initialize_chatbot(user_index, collection_name):
    """Initialize chatbot for a specific user's index."""
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=os.getenv("GOOGLE_API_KEY"))
    
    vectorstore = PineconeVectorStore(
        index_name=user_index, embedding=embeddings, namespace=collection_name
    )
    
    retriever = vectorstore.as_retriever()

    chat = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",  # Use the Gemini model
        temperature=0,
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        verbose=True
    )
    prompt_template = """
        Answer the question based solely on the provided context stored in Pinecone. Do not use any external knowledge or general information. If the context is empty or insufficient, respond with: "I don’t have enough information to answer that based on the provided context."

        Context: {context}
        Chat History: {chat_history}
        Question: {question}

        Answer:
        """
    prompt = PromptTemplate(input_variables=["context", "chat_history", "question"], template=prompt_template)
    qa = ConversationalRetrievalChain.from_llm(
            llm=chat,
            chain_type="stuff",
            retriever=retriever,
            combine_docs_chain_kwargs={"prompt": prompt},
            return_source_documents=True,
            verbose=True
    )
    return qa

def query_pinecone(query_text, user_index, collection_name):
    """Query chatbot with user index and collection filter."""
    if user_index not in chat_history:
        chat_history[user_index] = {}

    if collection_name not in chat_history[user_index]:
        chat_history[user_index][collection_name] = []

    qa = initialize_chatbot(user_index, collection_name)

    res = qa({
        "question": query_text, 
        "chat_history": chat_history[user_index][collection_name],
        # "filter": {"namespace": collection_name}
    })
    
    source_docs = res.get("source_documents", [])
    print("Query:", query_text)
    print("Retrieved Documents:", [doc.page_content if hasattr(doc, "page_content") else str(doc) for doc in source_docs])
    print("Answer:", res["answer"])
    
    chat_history[user_index][collection_name].append((query_text, res["answer"]))
    return res["answer"]
