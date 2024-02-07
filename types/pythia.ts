export interface PythiaInputProps {
  id: string
  userMessage: string
  response: string
  pythiaChatId: string
  createdAt: string
  updatedAt: string
}

export interface PythiaChatProps {
  id: string
  openmeshExpertUserId: string
  PythiaInputs: PythiaInputProps[]
  createdAt: string
  updatedAt: string
}
