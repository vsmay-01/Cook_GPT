import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import LandingPage from "./LandingPage";
import ChatInterface from "./ChatBotPage/ChatInterface";

const App = () => {
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
        <LandingPage />
        {/* <ChatInterface/> */}
      </div>
    </>
  );
};

export default App;
