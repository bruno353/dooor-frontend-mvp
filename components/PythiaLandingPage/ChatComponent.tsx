'use client'
// components/ChatComponent.tsx
import { useEffect, useState, useContext, useRef } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import { callAxiosBackend } from '@/utils/general-api'
import { useAccount } from 'wagmi'
import { ChatStorage, formatChatHistory } from '@/utils/chat-storage'
import ModelSelector, { models } from './ModelSelector'
import InQueryFlowAnimation from './InQueryFlowAnimation'
import { getSanitizeText } from '@/utils/functions-chat'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css' // import styles
import './react-quill.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'

interface ChatComponentProps {
  mode?: 'landing' | 'page'
  chatId?: string
}

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

export const ChatComponent = ({
  mode = 'landing',
  chatId,
}: ChatComponentProps) => {
  const router = useRouter()

  const { setChats, currentChat, setCurrentChat } = useContext(AccountContext)
  const [selectedModel, setSelectedModel] = useState(models[0])

  const [newMessageHtml, setNewMessageHtml] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInfoThumbDown, setIsInfoThumbDown] = useState<string | null>(null)
  const messagesEndRef = useRef(null)
  const { address } = useAccount()

  useEffect(() => {
    if (mode === 'page' && chatId) {
      const chat = ChatStorage.getChat(chatId)
      if (chat) {
        setCurrentChat(chat)
      }
    }
  }, [chatId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat])

  async function handleChat(message: string) {
    if (!message || message.length === 0) return
    setIsLoading(true)

    const chatToUpdate = currentChat || {
      id: Date.now().toString(),
      name: '',
      openmeshExpertUserId: 'local',
      model: selectedModel,
      PythiaInputs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const newInput = {
      id: Date.now().toString(),
      userMessage: message,
      response: '!$loading!$',
      pythiaChatId: chatToUpdate.id,
      badResponseFeedback: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    chatToUpdate.PythiaInputs.push(newInput)
    ChatStorage.saveChat(chatToUpdate)
    setCurrentChat({ ...chatToUpdate })
    setChats(ChatStorage.getAllChats())
    setNewMessageHtml('')

    try {
      const response = await callAxiosBackend(
        'post',
        '/dooor/ai/conversation',
        null,
        {
          message,
          chatHistory: formatChatHistory(chatToUpdate.PythiaInputs),
          signature: address || '0x',
        },
      )
      await new Promise((resolve) => setTimeout(resolve, 7500))

      newInput.response = response.data.content
      newInput.updatedAt = new Date().toISOString()
      chatToUpdate.PythiaInputs[chatToUpdate.PythiaInputs.length - 1] = newInput

      ChatStorage.saveChat(chatToUpdate)
      setCurrentChat({ ...chatToUpdate })
      setChats(ChatStorage.getAllChats())
      if (mode === 'landing' && !currentChat) {
        router.push(`/chat/${chatToUpdate.id}`)
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('Error in chat')
    } finally {
      setIsLoading(false)
    }
  }

  function handleChangeNewMessage(value) {
    if (newMessageHtml.length < 5000) {
      setNewMessageHtml(value)
    }
  }

  const handleKeyPress = (event) => {
    if (
      event.key === 'Enter' &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      handleChat(newMessageHtml)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', handleKeyPress)
      return () => document.removeEventListener('keydown', handleKeyPress)
    }
  }, [newMessageHtml])

  return (
    <div className="mt-10 flex h-full max-h-[calc(100vh-6rem)] flex-1 flex-col justify-between px-[10px] pb-8 text-[16px] text-[#C5C4C4] md:mt-0 md:max-h-[calc(100vh-6rem)] md:px-[50px] md:pb-20 lg:pb-8 2xl:text-[18px]">
      <div className="relative mt-auto flex h-full w-full flex-col rounded-xl bg-[#F9F9F9] px-[20px] pb-[50px] pt-[40px] shadow-md md:px-[40px]">
        {currentChat?.PythiaInputs?.length > 0 ? (
          <div className="mb-[50px] grid gap-y-[0px] overflow-hidden overflow-y-auto scrollbar-thin scrollbar-track-[#F9F9F9] scrollbar-thumb-[#c5c4c4]">
            {currentChat?.PythiaInputs.map((input, index) => (
              <div
                key={index}
                className={`mx-auto mb-4 grid gap-y-[40px] text-[16px] text-[#000] md:w-[1000px] md:max-w-[1000px] ${
                  index > 0 && 'mt-[20px]'
                }`}
              >
                <div className="flex items-start gap-x-[10px] text-left">
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }/images/lateralNavBar/profile2.svg`}
                    alt="image"
                    className="mt-[2px]  w-[15px] xl:w-[22px]"
                  />
                  <div className="">
                    <div className="text-[15px] font-semibold">You</div>
                    <div className="break-all">
                      {getSanitizeText(input.userMessage)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-x-[10px] text-left">
                  <img
                    src={selectedModel.image}
                    alt="image"
                    className="mt-[2px]  w-[20px] xl:w-[25px]"
                  />
                  <div>
                    <div className="text-[15px] font-semibold">
                      {selectedModel.tag}
                    </div>
                    {input.response === '!$loading!$' ? (
                      <div className="mt-5">
                        {/* <svg
                          className="mt-1 animate-spin "
                          width="30px"
                          height="30px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612"
                            stroke="#3253FE"
                            strokeWidth="3.55556"
                            strokeLinecap="round"
                          />
                        </svg> */}
                        <InQueryFlowAnimation isLoading={true} />
                      </div>
                    ) : (
                      <div>
                        <div className="mb-2">{input.response}</div>
                        <div className="relative">
                          {!input.badResponseFeedback ? (
                            <img
                              src={`${
                                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                  ? process.env.NEXT_PUBLIC_BASE_PATH
                                  : ''
                              }/images/pythia/thumb-down.svg`}
                              alt="image"
                              className="mt-[2px] w-[17px] cursor-pointer"
                              onMouseEnter={() => setIsInfoThumbDown(input.id)}
                              onMouseLeave={() => setIsInfoThumbDown(null)}
                              //   onClick={() => {
                              //     insertBadFeedbackInput(input.id)
                              //   }}
                            />
                          ) : (
                            <img
                              src={`${
                                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                  ? process.env.NEXT_PUBLIC_BASE_PATH
                                  : ''
                              }/images/pythia/thumb-down-filled.svg`}
                              alt="image"
                              className="mt-[2px] w-[16.5px]"
                              onMouseEnter={() => setIsInfoThumbDown(input.id)}
                              onMouseLeave={() => setIsInfoThumbDown(null)}
                            />
                          )}

                          <div
                            className={`absolute  rounded-md bg-[#000] px-4 py-1 text-sm text-[#fff] ${
                              isInfoThumbDown === input.id ? '' : '!hidden'
                            } ${
                              index === currentChat?.PythiaInputs.length - 1
                                ? '-translate-y-14'
                                : 'translate-y-2'
                            }`}
                          >
                            Bad response
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="mx-auto  mt-auto mb-32">
            <img
              src={`images/logo/accelar-logo.svg`}
              alt="image"
              className={`mx-auto w-[40px]`}
            />
            <div className="mt-5 text-xl font-semibold text-[#000]">
              How can Accelar help you?
            </div>
          </div>
        )}

        <div
          className={`relative mt-auto flex w-full md:px-[40px] ${
            !address && 'cursor-not-allowed'
          }`}
        >
          {/* {isLoading && (
            <svg
              className="mt-1 animate-spin"
              height="40px"
              id="Icons"
              version="1.1"
              viewBox="0 0 80 80"
              width="40px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M58.385,34.343V21.615L53.77,26.23C50.244,22.694,45.377,20.5,40,20.5c-10.752,0-19.5,8.748-19.5,19.5S29.248,59.5,40,59.5  c7.205,0,13.496-3.939,16.871-9.767l-4.326-2.496C50.035,51.571,45.358,54.5,40,54.5c-7.995,0-14.5-6.505-14.5-14.5  S32.005,25.5,40,25.5c3.998,0,7.617,1.632,10.239,4.261l-4.583,4.583H58.385z" />
            </svg>
          )}{' '} */}
          <QuillNoSSRWrapper
            key={address ? 'connected' : 'disconnected'} // Adicionar esta linha
            readOnly={isLoading || !address}
            value={newMessageHtml}
            onChange={(e) => {
              handleChangeNewMessage(e)
            }}
            // disabled={isLoading}
            className={`my-quill mx-auto mt-2 w-full max-w-[900px] rounded-md border-[1px] border-[#EAEAEA] bg-[#fff] bg-[#787ca536] text-base font-normal text-[#fff] outline-0 2xl:max-w-[1000px] ${
              !address && 'pointer-events-none'
            }`}
            placeholder={
              address ? 'Type your query' : 'Connect wallet to start chatting'
            }
          />
        </div>

        <div className="absolute top-2 left-2 text-black">
          <ModelSelector
            onSelect={setSelectedModel}
            disabled={mode === 'page'}
          />
        </div>
      </div>
    </div>
  )
}
