import React from 'react';
import { useUser } from '@clerk/clerk-react';
import Sidebar from './BotPageCom/Sidebar';
import ChatInput from './BotPageCom/ChatInput';
import ProfileSec from './BotPageCom/ProfileSec';
import { SelectedCollectionProvider } from "../context/SelectedContext";
import { ChatResProvider } from "../context/ChatResContext"; // Use the correct provider

const ChatInterface = () => {
  const { isSignedIn, user } = useUser();

  return (
    <SelectedCollectionProvider>
      <ChatResProvider>
        <div className="w-full h-screen flex bg-gradient-to-b from-[#1a1a1a] to-[#121212] overflow-hidden">

          {/* Sidebar (Fixed Left) */}
          <div className="hidden lg:flex w-[280px] h-[50vh] bg-[#181818] bg-opacity-80 backdrop-blur-md shadow-lg fixed left-0 top-0 z-10 rounded-3xl mb-7">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-row items-start justify-start h-full max-w-full overflow-y-auto ml-[280px]">
            <div className="w-full max-w-3xl bg-[#1c1c1c] bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-700 mt-2 p-5 mb-3 ml-7">
              <h1 className="text-white text-3xl font-semibold text-center mb-8">
                Add title here if needed
              </h1>

              {/* ChatInput Section */}
              <div className="w-full flex flex-col items-center justify-start space-y-4">
                <ChatInput />
              </div>
            </div>

          </div>

          {/* Profile Icon */}
          <div className="absolute top-6 right-6 bg-[#ff8c42] rounded-full p-3 shadow-lg z-20">
            <ProfileSec />
          </div>

        </div>
      </ChatResProvider>
    </SelectedCollectionProvider>
  );
};

export default ChatInterface;
