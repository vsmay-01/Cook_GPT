import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useUser } from '@clerk/clerk-react';
import { SelectedCollectionContext } from "../../context/SelectedContext"; // Ensure this path is correct
import Loader from "./Loader";
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
  const [contentLoading,setcontentLoading] = useState(false);


  useEffect(() => {
    if (collectionName.length === 0) {
      setcontentLoading(true);
    }
  }, [collectionName]);

  const userCollection = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/index-info", {
        params: {
          user: user?.username,
        },
      });
      console.log(response.data);
      console.log(response.data.namespaces);
      setCollectionName(response.data.namespaces);
      setcontentLoading(false); // Stop loading once data is fetched
    } catch (e) {
      console.log("error", e);
      setcontentLoading(false); // Stop loading even if there's an error
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("File selected:", e.target.files[0]?.name);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    if (!newCollectionName.trim()) {
      setMessage("Please enter a collection name");
      return;
    }

    setLoading(true);
    setMessage("Uploading file...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", user?.username);
    formData.append("collection", newCollectionName);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);
      setNewCollectionName("");
      setMessage("File uploaded successfully!");
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionClick = (collection) => {
    setSelected(collection);
  };

  useEffect(() => {
    user && userCollection();
  }, [user]);

  return ( 
    <div className="w-64 h-screen bg-gray-900 p-4 border-r flex flex-col relative">
      <h2 className="font-bold text-2xl text-gray-100 uppercase underline">
        Collections
      </h2>
      <div className="flex flex-col gap-3 mt-5">
        {contentLoading?<Loader/>:collectionName.map((collection, index) => (
          <div
            key={index}
            className={`text-white p-2 rounded-lg cursor-pointer ${
              selected === collection ? "bg-gray-700" : ""
            }`}
            onClick={() => handleCollectionClick(collection)}
          >
            <h2>{collection}</h2>
          </div>
        ))}
      </div>

      {/* File upload section */}
      <div className="my-4 p-4 border rounded-lg bg-gray-50 w-[80%] absolute bottom-9 ">
        <h2 className="text-lg font-semibold mb-2 text-black">Upload Document</h2>

        {/* Collection Name Input */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1 text-black">
            Collection Name (required)
          </label>
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
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
          <span className="flex-1 text-sm truncate">
            {file ? file.name : "No file selected (required)"}
          </span>
          <button
            onClick={handleUpload}
            disabled={loading || !file || !newCollectionName.trim()}
            className={`bg-black text-white p-2 rounded-lg ${
              loading || !file || !newCollectionName.trim()
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
