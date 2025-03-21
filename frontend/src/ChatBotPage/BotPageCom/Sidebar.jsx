import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from '@clerk/clerk-react'



export default function Sidebar() {
  const [selected, setSelected] = useState(null);
  const [collectionName, setCollectionName] = useState([]);
  const { isSignedIn, user, isLoaded } = useUser();
  const userCollection = async()=>{
    try {
      const response = await axios.get("http://127.0.0.1:5000/index-info", {
        params: {
          user: user?.username
        }
      });
      console.log(response.data);
      console.log(response.data.namespaces)
      setCollectionName(response.data.namespaces)
    } catch (e) {
      console.log("error", e);
    }


  }
  
  useEffect(()=>{
  user&&userCollection();
  },[user])

  return (
    <div className="w-64 h-screen bg-gray-900 p-4 border-r flex flex-col ">
      <h2 className="font-bold text-2xl text-gray-100 uppercase underline">
        Collections 
      </h2>
      <div>
        {collectionName.map((collection, index) => (
          <div key={index} className="text-white">
            <h2>{collection}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
