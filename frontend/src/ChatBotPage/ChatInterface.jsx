import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Sidebar from './BotPageCom/Sidebar';
import ChatInput from './BotPageCom/ChatInput';
import ProfileSec from './BotPageCom/ProfileSec';
import { SelectedCollectionProvider } from "../context/SelectedContext";
import { ChatResProvider } from "../context/ChatResContext";

const ChatInterface = () => {
  const { isSignedIn, user } = useUser();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <SelectedCollectionProvider>
      <ChatResProvider>
        <div className="w-full h-screen flex bg-gradient-to-b from-[#1a1a1a] to-[#121212] overflow-hidden">
          
          {/* Mobile sidebar toggle */}
          <button 
            onClick={toggleSidebar} 
            className="lg:hidden fixed top-6 left-6 z-50 bg-[#292929] text-white p-2 rounded-lg"
          >
            {sidebarVisible ? '✕' : '☰'}
          </button>

          {/* Sidebar (Left) */}
          <div className={`${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} 
                          lg:translate-x-0 fixed lg:relative z-40 w-72 h-screen 
                          transition-transform duration-300 ease-in-out`}>
            <Sidebar />
          </div>

          {/* Main Chat Area (Center) */}
          <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 
                          ${sidebarVisible ? 'lg:ml-0' : 'ml-0'}`}>
            
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 lg:px-8">
              <div className="max-w-3xl mx-auto">
                {/* Chat messages would go here */}
                <div className="h-full flex items-center justify-center">
                  <h1 className="text-2xl lg:text-4xl font-extrabold text-blue-600 text-center tracking-wide">
                    Manage Your Collections and Upload Documents
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Chat Input Area */}
            <div className="p-4 lg:px-8">
              <div className="max-w-3xl mx-auto bg-[#1c1c1c] bg-opacity-90 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700 p-3">
                <ChatInput />
              </div>
            </div>
          </div>

          {/* Profile Section (Right) */}
          <div className="w-72 h-screen hidden lg:block">
            <div className="h-full p-6 bg-[#1e1e1e] border-l border-[#2d2d2d] flex flex-col">
              <div className="mb-6 flex justify-center">
                <div className="bg-[#ff8c42] rounded-full p-3 shadow-lg">
                  <ProfileSec />
                </div>
              </div>
              
              {/* User profile info section */}
              <div className="bg-[#292929] rounded-lg p-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-100 mb-3">Profile Info</h3>
                {user && (
                  <>
                    <p className="text-gray-300">{user.username || 'User'}</p>
                    <p className="text-gray-400 text-sm mt-1">{user.primaryEmailAddress?.emailAddress || ''}</p>
                  </>
                )}
              </div>
              
              {/* Chat history or additional info can go here */}
              <div className="bg-[#292929] rounded-lg p-4 mt-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-100 mb-3">Chat History</h3>
                <div className="text-gray-400 text-sm">
                  <p>Previous conversations will appear here.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Profile Icon */}
          <div className="lg:hidden fixed top-6 right-6 bg-[#ff8c42] rounded-full p-3 shadow-lg z-50">
            <ProfileSec />
          </div>
        </div>
      </ChatResProvider>
    </SelectedCollectionProvider>
  );
};

export default ChatInterface;