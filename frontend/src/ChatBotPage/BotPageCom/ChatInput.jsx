import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { SelectedCollectionContext } from "../../context/SelectedContext";
import { ChatResContext } from "../../context/ChatResContext";
import ChatLoader from './ChatLoader';
import EmptyPage from './EmptyPage';

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState(null);
  const [msg, setMsg] = useState([]);
  const { selected } = useContext(SelectedCollectionContext);
  const { rerankedDocuments ,setRerankedDocuments } = useContext(ChatResContext);
  const { user } = useUser();
  
  // Reference to the chat container for auto-scrolling
  const chatContainerRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Auto-scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [msg]);

  const handleQuery = async () => {
    if (!userInput.trim()) {
      setMessage("Please enter a query");
      return;
    }
    if (!selected) {
      alert("Please select a collection first.");
      return;
    }

    const currentUserInput = userInput;
    setUserInput(""); // Clear input field immediately when query is sent
    setLoading(true);
    setMessage("Querying...");
    
    // Add user message immediately
    const userMessage = { text: currentUserInput, sender: "user" };
    setMsg((prev) => [...prev, userMessage]);
    
    // Add a temporary loading message (this will be replaced when response comes)
    const loadingMessageId = Date.now(); // Use timestamp as temp ID
    setMsg((prev) => [...prev, { id: loadingMessageId, loading: true, sender: "bot" }]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/query",
        {
          user: user?.username || "princekumar04",
          collection: selected || "default_collection",
          query: currentUserInput,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    // console.log(response.data.reranked_documents[0].content)
    setRerankedDocuments(response.data.reranked_documents[0].content);
      setResponse(response.data.llm_response);
      
      // Replace the loading message with the actual response
      setMsg((prev) => 
        prev.map(item => 
          item.id === loadingMessageId 
            ? { text:response.data.llm_response, sender: "bot" } 
            : item
        )
      );
      
      setMessage("Query completed successfully!");
    } catch (error) {
      // Replace the loading message with an error message
      setMsg((prev) => 
        prev.map(item => 
          item.id === loadingMessageId 
            ? { text: `Error: ${error.response?.data?.error || error.message}`, sender: "bot", isError: true } 
            : item
        )
      );
      
      setMessage(`Query failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  h-[80vh] bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg border border-gray-800">
      {/* Chat Header */}
      <div className="bg-[#242424] px-6 py-3 border-b border-gray-800">
        <h2 className="text-gray-200 font-medium">
          {selected ? `Collection: ${selected}` : "Select a collection to begin"}
        </h2>
      </div>

      {/* Chat History */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {msg.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <EmptyPage />
          </div>
        ) : (
          msg.map((m, index) => (
            <div
              key={index}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-[75%] ${
                  m.sender === "user"
                    ? "bg-[#ff8c42] text-white rounded-tr-none"
                    : m.isError 
                      ? "bg-[#933] text-gray-100 rounded-tl-none" 
                      : "bg-[#333] text-gray-100 rounded-tl-none"
                }`}
              >
                {m.loading ? (
                  <div className="flex items-center space-x-2">
                    <ChatLoader />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{m.text}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Query Input */}
      <div className="p-4 bg-[#242424] border-t border-gray-800">
        <div className="flex items-center bg-[#2d2d2d] rounded-lg overflow-hidden border border-gray-700 focus-within:border-[#ff8c42] transition-colors">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask something about your document..."
            className="flex-1 p-3 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleQuery()}
          />
          <button
            onClick={handleQuery}
            disabled={loading}
            className={`px-4 py-3 bg-[#ff8c42] text-white transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#ff7b30]"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Collection indicator */}
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>{selected ? `Querying: ${selected}` : "Please select a collection"}</span>
          {message && <span>{message}</span>}
        </div>
      </div>
    </div>
  );
}