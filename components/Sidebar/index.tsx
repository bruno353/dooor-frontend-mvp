/* eslint-disable no-useless-return */
/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect, useRef } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { AccountContext } from '@/contexts/AccountContext'
import nookies, { parseCookies, setCookie } from 'nookies'
import {
  changeChatName,
  deleteUserChat,
  getUserChats,
} from '@/utils/api-pythia'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  isToday,
  isWithinInterval,
  subDays,
  startOfDay,
  isBefore,
  endOfDay,
} from 'date-fns'
import { AiChatProps } from '@/types/pythia'
import { ChatStorage } from '@/utils/chat-storage'

/* eslint-disable react/no-unescaped-entities */
const Sidebar = ({ onValueChange }) => {
  const [categoriesOptions, setCategoriesOptions] = useState([])
  const [presetId, setPresetId] = useState(0)
  const { user, pythiaChat, pythiaUpdated, sidebarOpen, setSidebarOpen } =
    useContext(AccountContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pythiaChats, setPythiaChats] = useState<AiChatProps[]>()
  const [isChatMenuOpen, setIsChatMenuOpen] = useState<AiChatProps | null>()
  const [pythiaChatHovered, setPythiaChatHovered] =
    useState<AiChatProps | null>()
  const [pythiaChatRename, setPythiaChatRename] = useState<AiChatProps | null>()
  const [pythiaChatName, setPythiaChatName] = useState<string>('www')
  const [inputValue, setInputValue] = useState<string>('')
  const { push } = useRouter()

  const menuRef = useRef(null)
  const chatNameRef = useRef(null)

  useEffect(() => {
    const chats = ChatStorage.getAllChats()
    console.log('getting all chats history', chats)
    setPythiaChats(chats)
  }, [])

  function sendToChat(id: string) {
    push(`${`/chat/${id}`}`)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsChatMenuOpen(null)
      }
    }

    if (isChatMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isChatMenuOpen])

  const pythiaChatNameRef = useRef(pythiaChatName)

  useEffect(() => {
    pythiaChatNameRef.current = pythiaChatName
  }, [pythiaChatName])

  function handleDeletePythiaChat(chat: AiChatProps) {
    ChatStorage.deleteChat(chat.id)
    setPythiaChats(ChatStorage.getAllChats())
    push('/')
  }

  const renderChatItem = (chat: AiChatProps) => (
    <div className="flex items-center gap-2 p-2">
      <img src={chat.model.image} alt={chat.model.tag} className="h-4 w-4" />
      <div className="flex-1 truncate">
        {pythiaChatRename?.id === chat.id ? (
          <input
            ref={chatNameRef}
            value={pythiaChatName}
            onChange={(e) => setPythiaChatName(e.target.value)}
            className="w-full bg-transparent"
            autoFocus
          />
        ) : (
          <span>{chat.name || `Chat ${chat.id}`}</span>
        )}
      </div>
      {chat.model.tag && (
        <span className="text-gray-500 text-xs">{chat.model.tag}</span>
      )}
    </div>
  )

  function handleSaveNewChatName() {
    if (!pythiaChatName || !pythiaChatRename) return

    ChatStorage.renameChat(pythiaChatRename.id, pythiaChatName)
    setPythiaChats(ChatStorage.getAllChats())
    setPythiaChatRename(null)
    setPythiaChatName('')
    setIsChatMenuOpen(null)
  }

  const handleKeyPress = (event) => {
    if (
      event.key === 'Enter' &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      handleSaveNewChatName()
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatNameRef.current && !chatNameRef.current.contains(event.target)) {
        setPythiaChatRename(null)
      }
    }

    if (pythiaChatRename) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [pythiaChatRename])

  const validateDate = (chats) => {
    const categorizedChats = {
      today: [],
      lastSevenDays: [],
      older: [],
    }

    chats.forEach((chat) => {
      const createdAt = new Date(chat.createdAt)
      if (isToday(createdAt)) {
        categorizedChats.today.push(chat)
      } else if (
        isWithinInterval(createdAt, {
          start: subDays(startOfDay(new Date()), 7),
          end: new Date(),
        })
      ) {
        categorizedChats.lastSevenDays.push(chat)
      } else {
        categorizedChats.older.push(chat)
      }
    })

    return categorizedChats
  }

  useEffect(() => {
    const allChats = ChatStorage.getAllChats()
    if (inputValue.length > 0) {
      const filteredChats = allChats.filter((chat) => {
        const searchString = chat.name || `Chat ${chat.id}`
        return searchString.toLowerCase().includes(inputValue.toLowerCase())
      })
      setPythiaChats(filteredChats)
    } else {
      setPythiaChats(allChats)
    }
  }, [inputValue])

  useEffect(() => {
    setPythiaChats(ChatStorage.getAllChats())
  }, [pythiaChat])

  const arrayDateFilters = ['Today', 'Previous 7 days', 'Previous']
  function validateDateChat(date: string, chat: AiChatProps) {
    const createdAt = new Date(chat.createdAt)
    const now = new Date()

    if (date === 'Today') {
      return isToday(createdAt)
    } else if (date === 'Previous 7 days') {
      // Cria data de 7 dias atrás no início do dia
      const sevenDaysAgo = startOfDay(subDays(now, 7))
      // E compara com o fim de ontem (para excluir hoje)
      const yesterday = endOfDay(subDays(now, 1))
      console.log(createdAt)
      console.log('Checking interval:', {
        date: createdAt,
        start: sevenDaysAgo,
        end: yesterday,
        isWithin: isWithinInterval(createdAt, {
          start: sevenDaysAgo,
          end: yesterday,
        }),
      })

      return (
        !isToday(createdAt) && // Não é hoje
        isWithinInterval(createdAt, {
          start: sevenDaysAgo,
          end: yesterday,
        })
      )
    } else if (date === 'Previous') {
      // Mais de 7 dias atrás
      return isBefore(createdAt, subDays(startOfDay(now), 7))
    }
    return false
  }

  return (
    <>
      <div
        onMouseLeave={() => setSidebarOpen(false)}
        onMouseEnter={() => setSidebarOpen(true)}
        className={`relative !z-10 mt-[50px] h-full !bg-white shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] md:mt-0 md:!block ${
          !sidebarOpen && 'hidden'
        }`}
      >
        <div
          className={`!z-20 flex  flex-col items-start !bg-white ${
            sidebarOpen ? 'w-[300px] md:w-[280px]' : 'md:flex md:w-[100px]'
          }`}
        >
          <div className="mb-[14.5px] mt-[24.5px] ml-[16px]  flex flex-row items-center  justify-between !bg-white lg:mt-[49px] lg:mb-[29px] lg:ml-[32px]">
            <div className="absolute top-[10px] flex w-[10.5px] cursor-pointer flex-col items-center lg:top-[38px] lg:w-[21.5px]">
              <img
                onClick={() => setSidebarOpen(false)}
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/lateralNavBar/nav.svg`}
                className="hidden md:block"
                alt="image"
              />
              <a
                href={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? `/pythia/`
                    : '/'
                }`}
                className="absolute -top-[8px] left-[0px] flex w-[100px] cursor-pointer flex-col items-center lg:-top-[22px] lg:left-[50px] lg:w-[100px] "
              >
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                      ? process.env.NEXT_PUBLIC_BASE_PATH
                      : ''
                  }/images/logo/accelar-written-logo.svg`}
                  alt="image"
                  className={`mt-5 w-[100px] md:w-[40px] lg:w-[300px] ${
                    sidebarOpen ? '' : 'hidden'
                  }`}
                />
              </a>
            </div>
            <div className="absolute top-[60px] flex h-[25px] w-[10.5px] items-center gap-x-[20px] lg:top-[92px] lg:w-[21.5px]">
              {sidebarOpen && (
                <input
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                  }}
                  placeholder="Search chat"
                  className="h-[25px] w-[200px] rounded-[5px] border border-[#9e9e9e50] bg-transparent px-2 text-[13px] text-[#000] placeholder-body-color outline-none focus:border-primary md:w-[160px]"
                />
              )}
            </div>
          </div>
          <div className="!z-30 mt-[100px] grid gap-y-[10px] px-[22px] text-[13px] text-[#000]">
            {arrayDateFilters.map((filter) => {
              const chatsInFilter = pythiaChats?.filter((chat) =>
                validateDateChat(filter, chat),
              )

              if (!chatsInFilter?.length) return null

              return (
                <div key={filter} className="">
                  <div className="text-[#000000a8]">{filter}</div>
                  <div className="mt-[5px] mb-[5px] grid gap-y-[5px]">
                    {chatsInFilter.map((chat) => (
                      <div
                        key={chat.id}
                        onMouseEnter={() => setPythiaChatHovered(chat)}
                        onMouseLeave={() => setPythiaChatHovered(null)}
                        className={`${
                          pythiaChat?.id === chat.id ? 'bg-[#e2e2e25d]' : ''
                        } relative rounded-md hover:bg-[#e2e2e25d]`}
                      >
                        <div
                          className={`flex cursor-pointer items-center gap-2 p-2 ${
                            sidebarOpen ? 'w-[240px]' : 'max-w-[80px]'
                          }`}
                          onClick={() => sendToChat(chat.id)}
                        >
                          <img
                            src={chat.model?.image}
                            alt={chat.model?.tag || 'model'}
                            className="h-4 w-4"
                          />
                          <div className="flex-1 truncate">
                            {pythiaChatRename?.id === chat.id ? (
                              <input
                                ref={chatNameRef}
                                value={pythiaChatName}
                                onChange={(e) =>
                                  setPythiaChatName(e.target.value)
                                }
                                className="w-full bg-transparent outline-none"
                                autoFocus
                              />
                            ) : (
                              <span>{chat.name || `Chat ${chat.id}`}</span>
                            )}
                          </div>
                          {/* {chat.model?.tag && (
                            <span className="text-gray-500 text-xs">
                              {chat.model.tag}
                            </span>
                          )} */}
                        </div>

                        {pythiaChatHovered?.id === chat.id && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsChatMenuOpen(chat)
                            }}
                            className="absolute top-0 right-0 flex h-full cursor-pointer bg-[#e2e2e25d] px-[10px] text-[10px] backdrop-blur-sm"
                          >
                            <img
                              src={`${
                                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                  ? process.env.NEXT_PUBLIC_BASE_PATH
                                  : ''
                              }/images/pythia/dots.svg`}
                              alt="image"
                              className="my-auto w-[16px] cursor-pointer"
                            />
                          </div>
                        )}
                        {isChatMenuOpen?.id === chat.id && (
                          <div
                            ref={menuRef}
                            className="absolute top-0 right-0 !z-[999999] translate-x-[105%]  rounded-md border-[0.5px] bg-[#F9F9F9] py-[5px]"
                          >
                            <div
                              onClick={() => {
                                setPythiaChatRename(chat)
                                setPythiaChatName(chat.name)
                                setIsChatMenuOpen(null)
                              }}
                              className="flex cursor-pointer gap-x-[7px] rounded-sm px-[10px] py-[5px] hover:bg-[#e2e2e25d]"
                            >
                              <img
                                src={`${
                                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                    ? process.env.NEXT_PUBLIC_BASE_PATH
                                    : ''
                                }/images/pythia/pencil.svg`}
                                alt="image"
                                className="my-auto w-[18px]"
                              />
                              <div className="text-[#000000b7]">Rename</div>
                            </div>
                            <div
                              onClick={() => handleDeletePythiaChat(chat)}
                              className="flex cursor-pointer gap-x-[14px] rounded-sm px-[10px] py-[5px] hover:bg-[#e2e2e25d]"
                            >
                              <img
                                src={`${
                                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                    ? process.env.NEXT_PUBLIC_BASE_PATH
                                    : ''
                                }/images/pythia/garbage.svg`}
                                alt="image"
                                className="my-auto w-[12px]"
                              />
                              <div className="text-[#000000b7]">Delete</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
