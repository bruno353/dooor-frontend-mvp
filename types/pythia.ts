export interface AiInputProps {
  id: string
  userMessage: string
  response: string
  pythiaChatId: string
  badResponseFeedback: boolean
  chart?: string
  createdAt: string
  updatedAt: string
}

export interface AiChatProps {
  id: string
  name: string
  openmeshExpertUserId: string
  model: {
    name: string
    tag?: string
    image?: string
    description?: string
    soon?: boolean
  }
  PythiaInputs: AiInputProps[]
  createdAt: string
  updatedAt: string
}
