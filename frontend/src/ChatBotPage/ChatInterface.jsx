import React from 'react'
import Sidebar from './BotPageCom/Sidebar'
import ChatInput from './BotPageCom/ChatInput'

const ChatInterface = () => {
  return (
    <div className='grid grid-cols-12 h-full'>
        <div className='col-span-2 flex items-center justify-center'>
           <Sidebar/>
        </div>
        <div className='col-span-8 flex items-center justify-center'>
          <ChatInput/>
        </div>
        <div className='col-span-2 flex items-center justify-center bg-white text-black'>
            profile page
        </div>
    </div>
  )
}

export default ChatInterface
