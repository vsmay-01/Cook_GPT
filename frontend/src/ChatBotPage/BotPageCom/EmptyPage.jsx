import React from 'react';
import { useUser } from '@clerk/clerk-react';

const EmptyPage = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  
  return (
    <div className="flex items-center justify-center py-8 px-4 w-full bg-gray-900">
      {isSignedIn && user && (
        <div className="bg-[#333333] rounded-xl shadow-lg p-6 max-w-md w-full border border-gray-800">
          {/* Welcome Header with user avatar */}
          <div className="flex items-center space-x-3 mb-6">
            {user.imageUrl && (
              <img 
                src={user.imageUrl} 
                alt={user.firstName} 
                className="w-10 h-10 rounded-full border-2 border-[#a1c4fd]" 
              />
            )}
            <div>
              <div className="text-xl font-bold text-white">
                Welcome, {user.firstName}!
              </div>
              <div className="text-gray-400 text-sm">
                Let's explore your documents
              </div>
            </div>
          </div>
          
          {/* Steps Section */}
          <div className="space-y-5">
            <h4 className="text-lg font-semibold text-[#a1c4fd] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#a1c4fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Getting Started
            </h4>
            
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[#a1c4fd] to-[#8c9eff] rounded-full flex items-center justify-center mr-3 text-sm font-bold text-white shadow-md">
                  1
                </span>
                <div>
                  <p className="text-gray-300 font-medium">Select a collection</p>
                  <p className="text-gray-400 text-sm mt-1">Choose from your available document collections</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[#a1c4fd] to-[#8c9eff] rounded-full flex items-center justify-center mr-3 text-sm font-bold text-white shadow-md">
                  2
                </span>
                <div>
                  <p className="text-gray-300 font-medium">Upload new documents</p>
                  <p className="text-gray-400 text-sm mt-1">Add your own documents to create a new collection</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[#a1c4fd] to-[#8c9eff] rounded-full flex items-center justify-center mr-3 text-sm font-bold text-white shadow-md">
                  3
                </span>
                <div>
                  <p className="text-gray-300 font-medium">Ask questions</p>
                  <p className="text-gray-400 text-sm mt-1">Type your queries below to get answers from your documents</p>
                </div>
              </li>
            </ol>
          </div>
          
          {/* Quick tip */}
          <div className="mt-6 bg-[#2d2d2d] rounded-lg p-3 border border-gray-700">
            <div className="flex items-center text-[#a1c4fd] font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Pro Tip
            </div>
            <p className="text-gray-400 text-sm mt-1">
              For best results, ask specific questions about the content in your documents.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyPage;
