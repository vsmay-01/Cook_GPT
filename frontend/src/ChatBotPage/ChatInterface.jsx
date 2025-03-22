import React from 'react';
import { useUser } from '@clerk/clerk-react';
import Sidebar from './BotPageCom/Sidebar';
import ChatInput from './BotPageCom/ChatInput';
import ProfileSec from './BotPageCom/ProfileSec';
import { SelectedCollectionProvider } from "../context/SelectedContext";

const ChatInterface = () => {
  const { isSignedIn, user } = useUser();

  return (
    <SelectedCollectionProvider>
      <div className="relative flex h-screen bg-gradient-to-b from-[#1a1a1a] to-[#121212] overflow-hidden">

        {/* Sidebar (Fixed Left) */}
        <div className="w-[250px] h-screen bg-[#181818] bg-opacity-80 backdrop-blur-md shadow-lg p-4 fixed left-0 top-0 z-10 rounded-r-2xl flex flex-col justify-between">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-between pl-[260px] pt-10 pb-6">
          <div className="max-w-3xl w-full p-8 bg-[#1c1c1c] bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl border border-[#2d2d2d] mx-auto overflow-hidden">
            <h1 className="text-white text-2xl font-semibold text-center mb-6">
              {isSignedIn && user ? `Hello, ${user.firstName}!` : "Ask about your document..."}
            </h1>
            {/* ChatInput Section */}
            <div className="flex flex-col h-full justify-between">
              <ChatInput />
            </div>
          </div>
        </div>

        {/* Profile Icon */}
        <div className="absolute top-6 right-6 z-20">
          <ProfileSec />
        </div>

      </div>
    </SelectedCollectionProvider>
  );
};

export default ChatInterface;
