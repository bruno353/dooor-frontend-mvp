'use client'
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */

import Footer from '../Footer'
import { useEffect, useState, useContext } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css' // import styles
import './react-quill.css'
import nookies, { parseCookies, setCookie } from 'nookies'
import { getUserChat, inputUserChatMessage } from '@/utils/api-pythia'
import { AccountContext } from '@/contexts/AccountContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getSanitizeText } from '@/utils/functions-chat'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const ChatPage = (id: any) => {
  const [newMessageHtml, setNewMessageHtml] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { user, setPythiaChat, pythiaChat } = useContext(AccountContext)

  function handleChangeNewMessage(value) {
    if (newMessageHtml.length < 5000) {
      setNewMessageHtml(value)
    }
  }

  async function getData() {
    const { userSessionToken } = parseCookies()

    const data = {
      id: id.id,
    }

    try {
      const res = await getUserChat(data, userSessionToken)
      setPythiaChat(res)
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err.response.data.message}`)
    }
  }

  async function handleCreateNewInput() {
    const { userSessionToken } = parseCookies()
    const data = {
      id: id.id,
      userInput: newMessageHtml,
    }

    try {
      setNewMessageHtml('')
      const res = await inputUserChatMessage(data, userSessionToken)
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err.response.data.message}`)
    }
  }

  function newMessageSave() {
    if (!isLoading) {
      handleCreateNewInput()
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

  useEffect(() => {
    // Adiciona o event listener
    document.addEventListener('keydown', handleKeyPress)

    // Remove o event listener quando o componente é desmontado
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [newMessageHtml])

  useEffect(() => {
    getData()
  }, [id])

  // Render chat messages
  const renderChatMessages = () => {
    return (
      <div className="grid gap-y-[20px] overflow-hidden overflow-y-auto scrollbar-thin scrollbar-track-[#1D2144] scrollbar-thumb-[#c5c4c4] scrollbar-track-rounded-md scrollbar-thumb-rounded-md ">
        {pythiaChat?.PythiaInputs.map((input, index) => (
          <div
            key={index}
            className={`mx-auto mb-4 grid w-[1000px] max-w-[1000px] gap-y-[40px] text-[16px] text-[#000] ${
              index > 0 && 'mt-[30px]'
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
                <div className="">{input.response}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full max-h-[calc(100vh-6rem)] flex-1 flex-col justify-between px-[50px]  pb-16 text-[16px] text-[#C5C4C4] md:pb-20  lg:pb-8  2xl:text-[18px]">
        <div className="mt-auto flex h-full w-full flex-col rounded-xl bg-[#F9F9F9] px-[40px] pb-[50px] pt-[40px] shadow-md">
          {renderChatMessages()}

          <div className="mt-auto w-full  px-[40px]">
            {' '}
            <QuillNoSSRWrapper
              value={newMessageHtml}
              onChange={handleChangeNewMessage}
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

export default ChatPage
