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
    <div className="absolute top-6 right-6 z-50 bg-[#1c1c1c] bg-opacity-90 backdrop-blur-lg p-4 rounded-lg shadow-lg border-2 border-gray-600">
      <SignedOut>
        <SignInButton>
          <FaUserCircle size={32} className="text-gray-300 hover:text-white transition-all cursor-pointer" />
        </SignInButton>
      </SignedOut>
      <div>
      <UserButton />
        </div>
      <SignedIn>
       
        {/* Display reranked documents */}
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
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default ProfileSec;
