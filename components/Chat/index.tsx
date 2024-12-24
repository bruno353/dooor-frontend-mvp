'use client'

import { ChatComponent } from '../PythiaLandingPage/ChatComponent'

const ChatPage = (id: any) => {
  return <ChatComponent mode="page" chatId={id.id} />
}

export default ChatPage
