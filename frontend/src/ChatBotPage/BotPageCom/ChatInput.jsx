import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { SelectedCollectionContext } from "../../context/SelectedContext";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState(null);
  const [msg, setMsg] = useState([]);
  const { selected, setSelected } = useContext(SelectedCollectionContext);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (selected !== undefined) {
      setSelected(selected);
    }
  }, [selected]);

  const handleQuery = async () => {
    if (!userInput.trim()) {
      setMessage("Please enter a query");
      return;
    }
    if (!selected) {
      alert("Please select a collection first.");
      return;
    }

    setLoading(true);
    setMessage("Querying...");
    setMsg((prev) => [...prev, { text: userInput, sender: "user" }]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/query",
        {
          user: user?.username || "princekumar04",
          collection: selected || "default_collection",
          query: userInput,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setResponse(response.data.response);
      setMsg((prev) => [...prev, { text: response.data.response, sender: "bot" }]);
      setMessage("Query completed successfully!");
    } catch (error) {
      setMessage(`Query failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#1e1e1e] text-gray-200 p-6">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto">
        {/* Chat History */}
        <div className="space-y-3 overflow-y-auto flex-1 bg-[#2d2d2d] p-4 rounded-lg shadow-md">
          {msg.length === 0 && (
            <div className="text-blue-500 text-center py-10">Ask about your document...</div> // Change color to blue theme
          )}
          {msg.map((m, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg w-fit max-w-[80%] ${m.sender === "user"
                  ? "bg-[#ff8c42] text-white self-end ml-auto"
                  : "bg-[#333] text-gray-100 self-start"
                }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Query Input */}
        <div className="mt-4 flex items-center w-full border-t border-gray-700 pt-3">
          {/* Ensure the input field has a height and is visible */}
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 p-3 bg-[#2d2d2d] border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            style={{ height: "40px", minWidth: "0" }}  // Set a fixed height for the input
          />

          {/* Button aligned with the input */}
          <button
            onClick={handleQuery}
            disabled={loading}
            className={`ml-2 bg-[#1e3c72] text-white p-3 rounded-lg transition-all ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#153b63]"} ${userInput.trim() === "" ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ height: "40px" }}  // Set the button height to match the input height
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
