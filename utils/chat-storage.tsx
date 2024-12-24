/* eslint-disable no-unused-vars */
// utils/chat-storage.ts
import { AiChatProps, AiInputProps } from '@/types/pythia'

const CHATS_KEY = 'dooor-chats'
const CURRENT_CHAT_KEY = 'dooor-current-chat'

export const ChatStorage = {
  // Salva um chat específico
  saveChat(chat: AiChatProps) {
    const chats = this.getAllChats()
    const existingIndex = chats.findIndex((c) => c.id === chat.id)

    if (existingIndex >= 0) {
      chats[existingIndex] = chat
    } else {
      chats.push(chat)
    }

    localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
    return chat
  },

  // Pega todos os chats
  getAllChats(): AiChatProps[] {
    if (typeof window !== 'undefined') {
      const chats = localStorage.getItem(CHATS_KEY)
      return chats ? JSON.parse(chats) : []
    }
  },

  // Pega um chat específico
  getChat(id: string): AiChatProps | null {
    const chats = this.getAllChats()
    return chats.find((chat) => chat.id === id) || null
  },

  // Deleta um chat
  deleteChat(id: string) {
    const chats = this.getAllChats().filter((chat) => chat.id !== id)
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
  },

  // Renomeia um chat
  renameChat(id: string, newName: string) {
    const chat = this.getChat(id)
    if (chat) {
      chat.name = newName
      this.saveChat(chat)
    }
  },
}

export function formatChatHistory(inputs: AiInputProps[]) {
  return inputs
    .filter((input) => input.response !== '!$loading!$') // Ignora mensagens em loading
    .map((input) => [
      {
        message: {
          content: input.userMessage,
          type: 'human',
        },
        timestamp: input.createdAt,
      },
      {
        message: {
          content: input.response,
          type: 'ai',
        },
        timestamp: input.updatedAt,
      },
    ])
    .flat()
}
