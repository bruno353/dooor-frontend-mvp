'use client'
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */

import Footer from '../Footer'
import { useEffect, useState, useContext, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css' // import styles
import './react-quill.css'
import nookies, { parseCookies, setCookie } from 'nookies'
import {
  createUserChat,
  getUserChat,
  inputNonUserChatMessage,
  inputUserChatMessage,
  insertBadFeedback,
} from '@/utils/api-pythia'
import { AccountContext } from '@/contexts/AccountContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getSanitizeText } from '@/utils/functions-chat'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import ModelSelector from './ModelSelector'
import { useAccount } from 'wagmi'
import QueryFlowAnimation from './QueryFlowAnimation'
import InQueryFlowAnimation from './InQueryFlowAnimation'
import { callAxiosBackend } from '@/utils/general-api'
import { ChatComponent } from './ChatComponent'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const PythiaLandingPage = () => {
  // const [newMessageHtml, setNewMessageHtml] = useState('')
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [isInfoThumbDown, setIsInfoThumbDown] = useState<string | null>(null)
  // const { user, setPythiaChat, pythiaChat, pythiaUpdated, setPythiaUpdated } =
  //   useContext(AccountContext)
  // const { push } = useRouter()
  // const { address, isConnecting, isDisconnected } = useAccount()

  // function handleChangeNewMessage(value) {
  //   if (newMessageHtml.length < 5000) {
  //     setNewMessageHtml(value)
  //   }
  // }

  // const messagesEndRef = useRef(null)

  // async function handleNonUserCreateChat() {
  //   const tempId = Date.now() // Usando timestamp como ID temporário

  //   if (!newMessageHtml || newMessageHtml.length === 0) {
  //     return
  //   }

  //   const newUserInput = {
  //     id: tempId.toString(),
  //     userMessage: newMessageHtml,
  //     response: '!$loading!$',
  //     pythiaChatId: 'id.id',
  //     badResponseFeedback: false,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   }
  //   let inputs = []

  //   if (pythiaChat) {
  //     const chatPythiaNew = { ...pythiaChat }
  //     inputs = [...pythiaChat.PythiaInputs]
  //     const finalInputs = [...inputs, newUserInput]

  //     chatPythiaNew.PythiaInputs = finalInputs

  //     setPythiaChat(chatPythiaNew)
  //   } else {
  //     const pythiaChat = {
  //       id: 'id.id',
  //       name: '',
  //       openmeshExpertUserId: 'id.id',
  //       PythiaInputs: [newUserInput],
  //       badResponseFeedback: false,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     }

  //     const chatPythiaNew = { ...pythiaChat }

  //     setPythiaChat(chatPythiaNew)
  //   }

  //   const data = {
  //     userInput: newMessageHtml,
  //   }

  //   try {
  //     setNewMessageHtml('')
  //     const res = await inputNonUserChatMessage(data)
  //     newUserInput.response = res.response
  //     const newInputToSet = [...inputs, newUserInput]
  //     const newChat = { ...pythiaChat }
  //     newChat.PythiaInputs = newInputToSet
  //     setPythiaChat(newChat)
  //   } catch (err) {
  //     console.log(err)
  //     toast.error(`Error: ${err.response.data.message}`)
  //   }
  // }

  // async function handleCreateChat() {
  //   if (!newMessageHtml || newMessageHtml.length === 0) return

  //   const tempId = Date.now()
  //   const timestamp = new Date().toISOString()

  //   const newUserInput = {
  //     id: tempId.toString(),
  //     userMessage: newMessageHtml,
  //     response: '!$loading!$',
  //     pythiaChatId: tempId.toString(),
  //     badResponseFeedback: false,
  //     createdAt: timestamp,
  //     updatedAt: timestamp,
  //   }

  //   const newChat = {
  //     id: tempId.toString(),
  //     name: '',
  //     openmeshExpertUserId: 'local',
  //     PythiaInputs: [newUserInput],
  //     createdAt: timestamp,
  //     updatedAt: timestamp,
  //   }

  //   setPythiaChat(newChat)
  //   saveChat(newChat)

  //   try {
  //     const response = await callAxiosBackend(
  //       'post',
  //       '/dooor/ai/conversation',
  //       null,
  //       {
  //         message: newMessageHtml,
  //         chatHistory: [],
  //         signature: address || '0x',
  //       },
  //     )

  //     newUserInput.response = response.data.content
  //     newUserInput.updatedAt = new Date().toISOString()

  //     newChat.PythiaInputs = [newUserInput]
  //     setPythiaChat(newChat)
  //     saveChat(newChat)

  //     setNewMessageHtml('')
  //   } catch (err) {
  //     console.error(err)
  //     toast.error('Error creating chat')
  //   }
  // }

  // async function handleContinueChat(userMessage: string) {
  //   if (!pythiaChat) return

  //   const tempId = Date.now()
  //   const timestamp = new Date().toISOString()

  //   const newUserInput = {
  //     id: tempId.toString(),
  //     userMessage,
  //     response: '!$loading!$',
  //     pythiaChatId: pythiaChat.id,
  //     badResponseFeedback: false,
  //     createdAt: timestamp,
  //     updatedAt: timestamp,
  //   }

  //   const updatedChat = {
  //     ...pythiaChat,
  //     PythiaInputs: [...pythiaChat.PythiaInputs, newUserInput],
  //     updatedAt: timestamp,
  //   }

  //   setPythiaChat(updatedChat)
  //   saveChat(updatedChat)

  //   try {
  //     const response = await callAxiosBackend(
  //       'post',
  //       '/dooor/ai/conversation',
  //       null,
  //       {
  //         message: userMessage,
  //         chatHistory: formatChatHistory(pythiaChat.PythiaInputs),
  //         signature: address || '0x',
  //       },
  //     )

  //     newUserInput.response = response.data.content
  //     newUserInput.updatedAt = new Date().toISOString()

  //     updatedChat.PythiaInputs[updatedChat.PythiaInputs.length - 1] =
  //       newUserInput
  //     setPythiaChat(updatedChat)
  //     saveChat(updatedChat)

  //     setNewMessageHtml('')
  //   } catch (err) {
  //     console.error(err)
  //     toast.error('Error continuing chat')
  //   }
  // }

  // function newMessageSave() {
  //   if (pythiaChat?.PythiaInputs.length > 0) {
  //     handleContinueChat(newMessageHtml)
  //   } else {
  //     handleCreateChat()
  //   }
  // }

  // const handleKeyPress = (event) => {
  //   if (
  //     event.key === 'Enter' &&
  //     !event.ctrlKey &&
  //     !event.shiftKey &&
  //     !event.altKey
  //   ) {
  //     newMessageSave()
  //   }
  // }

  // const scrollToBottomInstant = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
  // }

  // useEffect(() => {
  //   // Adiciona o event listener
  //   document.addEventListener('keydown', handleKeyPress)

  //   // Remove o event listener quando o componente é desmontado
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyPress)
  //   }
  // }, [newMessageHtml])

  // useEffect(() => {
  //   const savedChat = getChat()
  //   if (savedChat) {
  //     setPythiaChat(savedChat)
  //   }
  // }, [])

  // useEffect(() => {
  //   scrollToBottomInstant()
  // }, [pythiaChat])

  // async function insertBadFeedbackInput(inputId: string) {
  //   const { userSessionToken } = parseCookies()

  //   setIsLoading(true)
  //   const chatPythiaNew = { ...pythiaChat }
  //   const inputIndex = chatPythiaNew.PythiaInputs.findIndex(
  //     (pinput) => pinput.id === inputId,
  //   )
  //   chatPythiaNew.PythiaInputs[inputIndex].badResponseFeedback = true

  //   setPythiaChat(chatPythiaNew)

  //   const data = {
  //     id: inputId,
  //     isBadResponse: true,
  //   }

  //   try {
  //     await insertBadFeedback(data, userSessionToken)
  //   } catch (err) {
  //     console.log(err)
  //     toast.error(`Error: ${err.response.data.message}`)
  //   }
  //   setIsLoading(false)
  // }

  // // Render chat messages
  // const renderChatMessages = () => {
  //   return (
  //     <div className="mb-[50px] grid gap-y-[0px] overflow-hidden overflow-y-auto scrollbar-thin scrollbar-track-[#F9F9F9] scrollbar-thumb-[#c5c4c4]">
  //       {pythiaChat?.PythiaInputs.map((input, index) => (
  //         <div
  //           key={index}
  //           className={`mx-auto mb-4 grid gap-y-[40px] text-[16px] text-[#000] md:w-[1000px] md:max-w-[1000px] ${
  //             index > 0 && 'mt-[20px]'
  //           }`}
  //         >
  //           <div className="flex items-start gap-x-[10px] text-left">
  //             <img
  //               src={`${
  //                 process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                   ? process.env.NEXT_PUBLIC_BASE_PATH
  //                   : ''
  //               }/images/lateralNavBar/profile2.svg`}
  //               alt="image"
  //               className="mt-[2px]  w-[15px] xl:w-[22px]"
  //             />
  //             <div className="">
  //               <div className="text-[15px] font-semibold">You</div>
  //               <div className="break-all">
  //                 {getSanitizeText(input.userMessage)}
  //               </div>
  //             </div>
  //           </div>
  //           <div className="flex items-start gap-x-[10px] text-left">
  //             <img
  //               src={`${
  //                 process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                   ? process.env.NEXT_PUBLIC_BASE_PATH
  //                   : ''
  //               }/images/pythia/pythia-cube-logo.svg`}
  //               alt="image"
  //               className="mt-[2px]  min-w-[20px] xl:min-w-[25px]"
  //             />
  //             <div>
  //               <div className="text-[15px] font-semibold">Pythia</div>
  //               {input.response === '!$loading!$' ? (
  //                 <div>
  //                   <svg
  //                     className="mt-1 animate-spin "
  //                     width="30px"
  //                     height="30px"
  //                     viewBox="0 0 24 24"
  //                     fill="none"
  //                     xmlns="http://www.w3.org/2000/svg"
  //                   >
  //                     <path
  //                       d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612"
  //                       stroke="#3253FE"
  //                       strokeWidth="3.55556"
  //                       strokeLinecap="round"
  //                     />
  //                   </svg>
  //                   <InQueryFlowAnimation isLoading={true} />
  //                 </div>
  //               ) : (
  //                 <div>
  //                   <div className="mb-2">{input.response}</div>
  //                   <div className="relative">
  //                     {!input.badResponseFeedback ? (
  //                       <img
  //                         src={`${
  //                           process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                             ? process.env.NEXT_PUBLIC_BASE_PATH
  //                             : ''
  //                         }/images/pythia/thumb-down.svg`}
  //                         alt="image"
  //                         className="mt-[2px] w-[17px] cursor-pointer"
  //                         onMouseEnter={() => setIsInfoThumbDown(input.id)}
  //                         onMouseLeave={() => setIsInfoThumbDown(null)}
  //                         onClick={() => {
  //                           insertBadFeedbackInput(input.id)
  //                         }}
  //                       />
  //                     ) : (
  //                       <img
  //                         src={`${
  //                           process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
  //                             ? process.env.NEXT_PUBLIC_BASE_PATH
  //                             : ''
  //                         }/images/pythia/thumb-down-filled.svg`}
  //                         alt="image"
  //                         className="mt-[2px] w-[16.5px]"
  //                         onMouseEnter={() => setIsInfoThumbDown(input.id)}
  //                         onMouseLeave={() => setIsInfoThumbDown(null)}
  //                       />
  //                     )}

  //                     <div
  //                       className={`absolute  rounded-md bg-[#000] px-4 py-1 text-sm text-[#fff] ${
  //                         isInfoThumbDown === input.id ? '' : '!hidden'
  //                       } ${
  //                         index === pythiaChat?.PythiaInputs.length - 1
  //                           ? '-translate-y-14'
  //                           : 'translate-y-2'
  //                       }`}
  //                     >
  //                       Bad response
  //                     </div>
  //                   </div>
  //                 </div>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       ))}
  //       <div ref={messagesEndRef} />
  //     </div>
  //   )
  // }
  return <ChatComponent mode="landing" />
}

export default PythiaLandingPage
