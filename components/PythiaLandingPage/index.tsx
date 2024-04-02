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
} from '@/utils/api-pythia'
import { AccountContext } from '@/contexts/AccountContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getSanitizeText } from '@/utils/functions-chat'
import { PythiaChatProps, PythiaInputProps } from '@/types/pythia'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const PythiaLandingPage = () => {
  const [newMessageHtml, setNewMessageHtml] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { user, setPythiaChat, pythiaChat, pythiaUpdated, setPythiaUpdated } =
    useContext(AccountContext)
  const { push } = useRouter()

  function handleChangeNewMessage(value) {
    if (newMessageHtml.length < 5000) {
      setNewMessageHtml(value)
    }
  }

  const messagesEndRef = useRef(null)

  async function handleNonUserCreateChat() {
    const tempId = Date.now() // Usando timestamp como ID temporário

    if (!newMessageHtml || newMessageHtml.length === 0) {
      return
    }

    const newUserInput = {
      id: tempId.toString(),
      userMessage: newMessageHtml,
      response: '!$loading!$',
      pythiaChatId: 'id.id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    let inputs = []

    if (pythiaChat) {
      const chatPythiaNew = { ...pythiaChat }
      inputs = [...pythiaChat.PythiaInputs]
      const finalInputs = [...inputs, newUserInput]

      chatPythiaNew.PythiaInputs = finalInputs

      setPythiaChat(chatPythiaNew)
    } else {
      const pythiaChat = {
        id: 'id.id',
        name: '',
        openmeshExpertUserId: 'id.id',
        PythiaInputs: [newUserInput],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const chatPythiaNew = { ...pythiaChat }

      setPythiaChat(chatPythiaNew)
    }

    const data = {
      userInput: newMessageHtml,
    }

    try {
      setNewMessageHtml('')
      const res = await inputNonUserChatMessage(data)
      newUserInput.response = res.response
      const newInputToSet = [...inputs, newUserInput]
      const newChat = { ...pythiaChat }
      newChat.PythiaInputs = newInputToSet
      setPythiaChat(newChat)
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err.response.data.message}`)
    }
  }

  async function handleCreateChat() {
    console.log('fui chamado')
    const { userSessionToken } = parseCookies()
    const tempId = Date.now() // Usando timestamp como ID temporário

    if (!newMessageHtml || newMessageHtml.length === 0) {
      return
    }

    // Adicionando a mensagem do usuário ao chat imediatamente
    const newUserInput = {
      id: tempId.toString(),
      userMessage: newMessageHtml,
      response: '!$loading!$',
      pythiaChatId: 'id.id', // Asumindo que este é o ID correto para pythiaChatId
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const pythiaChat = {
      id: 'id.id',
      name: '',
      openmeshExpertUserId: 'id.id',
      PythiaInputs: [newUserInput],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setPythiaChat(pythiaChat)
    console.log('passei')

    const data = {
      userInput: newMessageHtml,
    }

    try {
      setNewMessageHtml('')
      const res = await createUserChat(data, userSessionToken)
      push(
        `${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
            ? `/pythia/chat/${res.id}`
            : `/chat/${res.id}`
        }`,
      )
      setPythiaUpdated(!pythiaUpdated)
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err.response.data.message}`)
    }
  }

  function newMessageSave() {
    if (!user) {
      handleNonUserCreateChat()
    } else {
      handleCreateChat()
    }
  }

  const handleKeyPress = (event) => {
    if (
      event.key === 'Enter' &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      newMessageSave()
    }
  }

  const scrollToBottomInstant = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
  }

  useEffect(() => {
    // Adiciona o event listener
    document.addEventListener('keydown', handleKeyPress)

    // Remove o event listener quando o componente é desmontado
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [newMessageHtml])

  useEffect(() => {
    scrollToBottomInstant()
  }, [pythiaChat])

  // Render chat messages
  const renderChatMessages = () => {
    return (
      <div className="mb-[50px] grid gap-y-[0px] overflow-hidden overflow-y-auto scrollbar-thin scrollbar-track-[#1D2144] scrollbar-thumb-[#c5c4c4] scrollbar-track-rounded-md scrollbar-thumb-rounded-md ">
        {pythiaChat?.PythiaInputs.map((input, index) => (
          <div
            key={index}
            className={`mx-auto mb-4 grid w-[1000px] max-w-[1000px] gap-y-[40px] text-[16px] text-[#000] ${
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
                className="mt-[2px]  w-[15px] xl:w-[20px]"
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
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/pythia/pythia-cube-logo.svg`}
                alt="image"
                className="mt-[2px]  w-[20px] xl:w-[25px]"
              />
              <div>
                <div className="text-[15px] font-semibold">Pythia</div>
                {input.response === '!$loading!$' ? (
                  <svg
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
                  </svg>
                ) : (
                  <div className="">{input.response}</div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full max-h-[calc(100vh-6rem)] flex-1 flex-col justify-between px-[50px]  pb-16 text-[16px] text-[#C5C4C4] md:pb-20  lg:pb-8  2xl:text-[18px]">
        <div className="mt-auto flex h-full w-full flex-col rounded-xl bg-[#F9F9F9] px-[40px] pb-[50px] pt-[40px] shadow-md">
          {pythiaChat?.PythiaInputs?.length > 0 ? (
            renderChatMessages()
          ) : (
            <div className="mx-auto  mt-auto mb-32">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/logo/pythia-cube.svg`}
                alt="image"
                className={`mx-auto w-[40px]`}
              />
              <div className="mt-5 text-xl font-semibold text-[#000]">
                How can Pythia help you?
              </div>
            </div>
          )}

          <div className="mt-auto flex  w-full px-[40px]">
            {isLoading && (
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
            )}{' '}
            <QuillNoSSRWrapper
              readOnly={isLoading}
              value={newMessageHtml}
              onChange={(e) => {
                handleChangeNewMessage(e)
              }}
              // disabled={isLoading}
              className="my-quill mx-auto mt-2 w-full max-w-[900px] rounded-md border-[1px] border-[#EAEAEA] bg-[#fff] bg-[#787ca536] text-base font-normal text-[#fff] outline-0 2xl:max-w-[1000px]"
              placeholder="Type your query"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default PythiaLandingPage
