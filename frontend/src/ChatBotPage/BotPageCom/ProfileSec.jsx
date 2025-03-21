import React from 'react'
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
  } from "@clerk/clerk-react";



const ProfileSec = () => {
  return (
    <div className=''>
        <div className=' mt-2 pl-3'>
        <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
        </div>
       
      
    </div>
  )
}

export default ProfileSec
