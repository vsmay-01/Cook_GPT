import { useState } from "react";
import axios from "axios";
import { useUser } from '@clerk/clerk-react'



export default function Dashboard() {
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState(null);
  const [collectionName, setCollectionName] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("File selected:", e.target.files[0]?.name);
  };

  const { isSignedIn, user, isLoaded } = useUser()
        user&&console.log(user.username)
        const userName = user?.username;

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    if (!collectionName.trim()) {
      setMessage("Please enter a collection name");
      return;
    }

    setLoading(true);
    setMessage("Uploading file...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", userName);
    formData.append("collection", collectionName);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);
      response.data&&setCollectionName(" ");
      setMessage("File uploaded successfully!");
      alert("file Uploaded success")
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!userInput.trim()) {
      setMessage("Please enter a query");
      return;
    }

    if (!collectionName.trim()) {
      setMessage("Please enter a collection name for querying");
      return;
    }

    setLoading(true);
    setMessage("Querying...");

    try {
      const response = await axios.post("http://127.0.0.1:5000/query", {
        user: userName,
        collection: collectionName,
        query: userInput
      });

      console.log("Query response:", response.data);
      setResponse(response.data.response);
      setMessage("Query completed successfully!");
    } catch (error) {
      console.error("Query error:", error);
      setMessage(`Query failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        <div className="space-y-3">
          {message && (
            <div className="bg-gray-100 p-3 rounded-lg">
              {message}
            </div>
          )}
          {response && (
            <div className="bg-blue-100 p-3 rounded-lg">
              <h3 className="font-bold">Response:</h3>
              <p>{response}</p>
            </div>
          )}
        </div>
        
        {/* File upload section */}
        <div className="my-4 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Upload Document</h2>
          
          {/* Collection Name Input */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Collection Name (required)</label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Enter collection name"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          
          {/* File Selection */}
          <div className="flex items-center space-x-2">
            <label className="bg-gray-200 text-black p-2 rounded-lg cursor-pointer">
              📁 Select File
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                required
              />
            </label>
            <span className="flex-1 text-sm truncate">{file ? file.name : "No file selected (required)"}</span>
            <button 
              onClick={handleUpload}
              disabled={loading || !file || !collectionName.trim()}
              className={`bg-black text-white p-2 rounded-lg ${loading || !file || !collectionName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Upload
            </button>
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
            className={`ml-2 bg-black text-white p-2 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}