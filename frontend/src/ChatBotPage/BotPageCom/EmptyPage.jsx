import React from 'react'
import { useUser } from '@clerk/clerk-react'

const EmptyPage = () => {
    const { isSignedIn, user, isLoaded } = useUser()
  return (
    <div className=''>
    {isSignedIn && user && (
        <div className="text-lg font-bold mt-4 text-white">
            <div> WelCome!!, {user.firstName}!</div>
            <h4> </h4>
         
        </div>
       
      )}
      
    </div>
  )
}

export default EmptyPage
