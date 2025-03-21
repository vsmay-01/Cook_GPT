import { useState } from "react";
import axios from "axios";
import { useUser } from '@clerk/clerk-react';
import { useContext , useEffect } from "react";
import { SelectedCollectionContext } from "../../context/SelectedContext";
import EmptyPage from "./EmptyPage";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [msg, setMsg] = useState([]);
   const { selected, setSelected } = useContext(SelectedCollectionContext);

  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (selected !== undefined) {
      setCollectionName(selected);
    }
  }, [selected]);
  user && console.log(user.username);
  console.log(selected)


  const handleQuery = async () => {
    console.log('collection:', collectionName);
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
    setMsg((prev) => [...prev, { text: userInput, sender: "user" }]); // Add user input to the message list

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/query",
        {
          user: "princekumar04", // Match exactly what's in your Postman example
          collection: collectionName || "abcd", // Use the collection name from input or fallback to "abcd"
          query: userInput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Query response:", response.data);
      setResponse(response.data.response);
      setMsg((prev) => [...prev, { text: response.data.response, sender: "bot" }]); // Add bot response to the message list
      setMessage("Query completed successfully!");
    } catch (error) {
      console.error("Query error:", error);
      setMessage(`Query failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
      setUserInput(""); // Clear the input field after query
    }
  };
   

  return (
    <div className="flex h-screen w-full">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        <div className="space-y-3">
          {message && (
            <div className="bg-gray-100 p-3 rounded-lg">{message}</div>
          )}
          <div className="space-y-2">
            {msg.map((m, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  m.sender === "user"
                    ? "bg-green-100 self-end text-right"
                    : "bg-blue-100 self-start text-left"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
        </div>

        {/* Query input */}
        <div className="mt-auto border-t pt-4 flex items-center w-full">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about your document..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={handleQuery}
            disabled={loading}
            className={`ml-2 bg-black text-white p-2 rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}