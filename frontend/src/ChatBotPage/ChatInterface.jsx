import {React, useState} from 'react';
import { useUser } from '@clerk/clerk-react';
import Sidebar from './BotPageCom/Sidebar';
import ChatInput from './BotPageCom/ChatInput';
import ProfileSec from './BotPageCom/ProfileSec';
import { SelectedCollectionProvider } from "../context/SelectedContext";
import { ChatResProvider } from "../context/ChatResContext";

const ChatInterface = () => {
  const { isSignedIn, user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SelectedCollectionProvider>
      <ChatResProvider>
        <div className="w-full h-screen flex flex-col lg:flex-row bg-gradient-to-b from-[#1a1a1a] to-[#121212] overflow-hidden">

          {/* Mobile Sidebar Button */}
          <div className="lg:hidden fixed top-4 left-4 z-30">
            <button
              className="bg-gray-800 text-white p-2 rounded-lg shadow-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
          </div>

          {/* Sidebar (Hidden on small screens, slides in when button is clicked) */}
          <div className={`lg:w-1/5 fixed top-0 left-0 h-full bg-[#181818] bg-opacity-80 backdrop-blur-md shadow-lg p-5 transition-transform duration-300 ease-in-out z-40 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
            <Sidebar />
            {/* Close Button (only visible on small screens) */}
            <button
              className="lg:hidden mt-4 bg-red-500 text-white px-3 py-1 rounded-md"
              onClick={() => setIsSidebarOpen(false)}
            >
              Close
            </button>
          </div>

          {/* Clickable overlay to close sidebar when open */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          {/* Main Content */}
          <div className="lg:w-3/5 w-full flex flex-col items-center justify-start h-full max-w-full overflow-y-hidden lg:ml-[20%] p-5">
            <div className="w-full max-w-3xl bg-transparent bg-opacity-0 backdrop-blur-lg rounded-3xl shadow-xl  p-5">
              {/* <h1 className="text-4xl font-sans-bold text-blue-600 text-center mb-8 tracking-wide">
               Hello, there!!
              </h1> */}

              {/* ChatInput Section */}
              <div className="w-[100%] flex flex-col items-center justify-start space-y-4 ">
                <ChatInput />
              </div>
            </div>
          </div>

          {/* Right Sidebar (Moves below main content on small screens) */}
          <div className="lg:w-1/5 w-full lg:h-screen hidden lg:flex justify-center lg:items-start lg:relative absolute bottom-0 p-5">
            <div className="bg-[#181818] bg-opacity-80 backdrop-blur-md shadow-lg rounded-3xl p-4 w-full max-w-xs">
              <ProfileSec />
            </div>
          </div>
        </div>
      </ChatResProvider>
    </SelectedCollectionProvider>

  );
};

export default ChatInterface;