import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import LandingPage from "./LandingPage";
import ChatInterface from "./ChatBotPage/ChatInterface";
import { useUser } from '@clerk/clerk-react'

const App = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  
  return (
    <>
      {/* <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header> */}
      <div>
        {/* <LandingPage /> */}
        <ChatInterface/>
      </div>
    </>
  );
};

export default App;
