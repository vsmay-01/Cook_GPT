import React, { useContext, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { FaUserCircle } from "react-icons/fa";
import { ChatResContext } from "../../context/ChatResContext";

const ProfileSec = () => {
  const { rerankedDocuments } = useContext(ChatResContext); // Access ChatResContext
  const { user } = useUser(); // Access user object

  useEffect(() => {
    console.log(rerankedDocuments);
  }, [rerankedDocuments]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-[#1A1A1A]/80 backdrop-blur-md p-3 rounded-lg shadow-lg border border-[#3B82F6]/50 w-[85%] sm:w-[300px] md:w-[350px] max-h-[80vh] overflow-hidden">
      {/* Profile Icon Section */}
      <div className="absolute top-2 right-2 z-60 flex justify-end">
        <SignedOut>
          <SignInButton>
            <FaUserCircle
              size={28}
              className="text-gray-300 hover:text-[#3B82F6] transition-all cursor-pointer"
            />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      {/* Reranked Documents Section */}
      <SignedIn>
        <div className="mt-10 text-sm text-gray-300">
          <h3 className="font-semibold text-[#3B82F6] text-xs md:text-sm">
            Reranked Documents:
          </h3>
          <div className="mt-2 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#3B82F6] scrollbar-track-[#1A1A1A]">
            {rerankedDocuments?.length > 0 ? (
              <p className="text-gray-200 text-xs md:text-sm whitespace-pre-wrap">
                {rerankedDocuments}
              </p>
            ) : (
              <p className="text-gray-400 text-xs md:text-sm">
                No documents available.
              </p>
            )}
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default ProfileSec;
