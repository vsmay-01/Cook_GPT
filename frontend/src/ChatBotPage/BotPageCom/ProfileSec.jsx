import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { FaUserCircle } from "react-icons/fa";

const ProfileSec = () => {
  return (
    <div className="absolute top-4 right-4 z-50">
      <SignedOut>
        <SignInButton>
          <FaUserCircle size={32} className="text-gray-300 hover:text-white transition-all cursor-pointer" />
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default ProfileSec;
