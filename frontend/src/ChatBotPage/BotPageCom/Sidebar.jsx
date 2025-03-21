import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useUser } from "@clerk/clerk-react";
import { SelectedCollectionContext } from "../../context/SelectedContext"; // Ensure this path is correct

export default function Sidebar() {
  const context = useContext(SelectedCollectionContext);
  if (!context) {
    throw new Error("Sidebar must be used within a SelectedCollectionContext.Provider");
  }
  const { selected, setSelected } = context; // Use context here
  const [collectionName, setCollectionName] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const { isSignedIn, user, isLoaded } = useUser();

  const userCollection = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/index-info", {
        params: {
          user: user?.username,
        },
      });
      setCollectionName(response.data.namespaces);
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    user && userCollection();
  }, [user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !newCollectionName.trim()) {
      setMessage("Both file and collection name are required.");
      return;
    }

    setLoading(true);
    setMessage("Uploading file...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", user?.username);
    formData.append("collection", newCollectionName);

    try {
      await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewCollectionName("");
      setMessage("File uploaded successfully!");
      alert("File uploaded successfully!");
    } catch (error) {
      setMessage(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-72 h-screen bg-[#1e1e1e] p-6 border-r border-[#2d2d2d] flex flex-col relative shadow-md">
      {/* Sidebar Header */}
      <h2 className="text-lg font-semibold text-gray-100 uppercase tracking-widest pb-4 border-b border-[#2d2d2d]">
        Collections
      </h2>

      {/* Collections List */}
      <div className="flex flex-col gap-3 mt-5">
        {collectionName.map((collection, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
              selected === collection
                ? "bg-[#292929] text-[#ff8c42] font-medium shadow-sm"
                : "bg-transparent hover:bg-[#252525] text-gray-300"
            }`}
            onClick={() => setSelected(collection)}
          >
            {collection}
          </div>
        ))}
      </div>

      {/* Upload Section */}
      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-[#292929] shadow-lg">
        <h2 className="text-lg font-semibold mb-3 text-gray-200">Upload Document</h2>

        {/* Collection Name Input */}
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="Enter collection name"
          className="w-full p-2 text-gray-100 bg-[#1e1e1e] border border-[#383838] rounded-lg focus:border-[#ff8c42] focus:outline-none placeholder-gray-500"
        />

        {/* File Upload Button */}
        <div className="flex items-center space-x-3 mt-3">
          <label className="flex items-center justify-center bg-[#383838] hover:bg-[#444444] text-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200">
            📁 Select File
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
          <span className="text-sm text-gray-400">
            {file ? file.name : "No file selected"}
          </span>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading || !file || !newCollectionName.trim()}
          className={`mt-3 w-full py-2 text-center font-medium text-white rounded-lg transition-all duration-200 ${
            loading || !file || !newCollectionName.trim()
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#ff8c42] hover:bg-[#ff7b30]"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {message && <p className="text-xs text-gray-300 mt-2">{message}</p>}
      </div>
    </div>
  );
}
