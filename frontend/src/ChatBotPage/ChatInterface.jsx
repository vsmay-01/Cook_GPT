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
      <div className=" rounded-2xl w-full flex h-screen bg-gradient-to-b from-[#1a1a1a] to-[#121212] overflow-hidden p-5">
        
        {/* Sidebar (Fixed Left) */}
        <div className="hidden lg:flex rounded-xl w-[200px] h-full bg-[#181818] bg-opacity-80 backdrop-blur-md shadow-lg p-4 fixed left-0 top-0 z-10 rounded-r-2xl">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className=" flex-1 flex flex-col  items-center justify-center -[300px] h-[90vh] w-[80vw] mt-6 ">
          <div className="max-w-3xl w-full p-8 bg-[#1c1c1c] bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700 mx-auto">
            <h1 className="text-white text-2xl font-semibold text-center mb-6">
             
            </h1>
            {/* ChatInput Section */}
            <div className="flex flex-col h-full justify-between">
              <ChatInput />
            </div>
          </div>
        </div>

        {/* Profile Icon */}
        <div className=" w top-6 right-6 bg-white">
          <ProfileSec />
        </div>

      </div>
      </ChatResProvider>
    </SelectedCollectionProvider>
  );
};

export default ChatInterface;
