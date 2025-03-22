import React, { useContext, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { FaUserCircle } from "react-icons/fa";
import { ChatResContext } from "../../context/ChatResContext"; // Import ChatResContext

const ProfileSec = () => {
  const { rerankedDocuments } = useContext(ChatResContext); // Access ChatResContext

  useEffect(() => {
    console.log(rerankedDocuments);
  }, []);

  return (
<<<<<<< HEAD
    <div className="absolute top-6 right-6 z-50 bg-[#1c1c1c] bg-opacity-90 backdrop-blur-lg p-4 rounded-lg shadow-lg border-2 border-gray-600">
=======
    <div className="absolute w-60 top-4 right-4 z-50 p-4 rounded-lg shadow-md">
>>>>>>> 31e407a383d2c7c45168bc4afaf03b7f8f4c85f0
      <SignedOut>
        <SignInButton>
          <FaUserCircle size={32} className="text-gray-300 hover:text-white transition-all cursor-pointer" />
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
        {/* Display reranked documents */}
<<<<<<< HEAD
        <div className="mt-4 text-sm text-gray-300">
          <h3 className="font-semibold text-white">Reranked Documents:</h3>
          <div className="h-[60vh] overflow-scroll mt-4 scrollbar-hide">
            {rerankedDocuments.length > 0 ? (
              <ul className="list-disc pl-5">
                {rerankedDocuments.map((doc, index) => (
                  <li key={index} className="text-gray-400">
                    {doc}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No documents available.</p>
            )}
=======
        <div className="mt-4 text-sm text-gray-700">
          <h3 className="font-semibold">Reranked Documents:</h3>
          <div className="hidden lg:flex h-[60vh] overflow-scroll mt-16 scrollbar-hide">
            {rerankedDocuments.length > 0 ? 
              <h2 className="list-disc pl-5">
                {rerankedDocuments}
              </h2>
            : 
              <p>No documents available.</p>
            }
>>>>>>> 31e407a383d2c7c45168bc4afaf03b7f8f4c85f0
          </div>
        </div>
      </SignedIn>
    </div>

  );
};

export default ProfileSec;
