import os
import warnings
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain_community.chat_models import ChatOpenAI
from langchain_pinecone import PineconeVectorStore

warnings.filterwarnings("ignore")
load_dotenv()

chat_history = {}

def initialize_chatbot(user_index):
    """Initialize chatbot for a specific user's index."""
    embeddings = OpenAIEmbeddings(openai_api_type=os.environ.get("OPENAI_API_KEY"))
    
    vectorstore = PineconeVectorStore(
        index_name=user_index, embedding=embeddings
    )

    chat = ChatOpenAI(verbose=True, temperature=0, model_name="gpt-3.5-turbo")

    qa = ConversationalRetrievalChain.from_llm(
        llm=chat, chain_type="stuff", retriever=vectorstore.as_retriever()
    )  

    return qa

def query_pinecone(query_text, user_index, collection_name):
    """Query chatbot with user index and collection filter."""
    if user_index not in chat_history:
        chat_history[user_index] = {}

    if collection_name not in chat_history[user_index]:
        chat_history[user_index][collection_name] = []

    qa = initialize_chatbot(user_index)

    res = qa({
        "question": query_text, 
        "chat_history": chat_history[user_index][collection_name],
        "filter": {"collection": collection_name}  # Filtering inside index
    })
    
    chat_history[user_index][collection_name].append((query_text, res["answer"]))
    return res["answer"]
