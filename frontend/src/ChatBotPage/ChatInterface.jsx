import React from 'react'
import Sidebar from './BotPageCom/Sidebar'
import ChatInput from './BotPageCom/ChatInput'
import ProfileSec from './BotPageCom/ProfileSec'

const ChatInterface = () => {
  return (
    <div className='grid grid-cols-12 h-full'>
        <div className='col-span-2 flex items-center justify-center'>
           <Sidebar/>
        </div>
        <div className='col-span-8 flex items-center justify-center'>
          <ChatInput/>
        </div>
        <div className='relative col-span-2 bg-white text-black'>
           <ProfileSec className='absolute top-4 right-4' />
        </div>
    </div>
  )
}

export default ChatInterface
