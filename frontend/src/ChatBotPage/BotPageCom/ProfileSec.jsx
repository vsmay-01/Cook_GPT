import React from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useUser } from '@clerk/clerk-react';

const ProfileSec = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <div className=''>
      <div className='mt-2 pl-3'>
        <header>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      </div>
      {/* Display the user's first name */}
      {isSignedIn && user && (
        <div className="text-lg font-bold mt-4">
          Hello, {user.firstName}!
        </div>
      )}
    </div>
  );
};

export default ProfileSec;