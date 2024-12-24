/* eslint-disable no-unused-vars */
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useContext, useRef } from 'react'
import ThemeToggler from './ThemeToggler'
import menuData from './menuData'
import { UserCircle } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import nookies, { parseCookies, destroyCookie, setCookie } from 'nookies'
import axios from 'axios'
import { AccountContext } from '../../contexts/AccountContext'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useConfig, useAccount } from 'wagmi'
import { writeContract, signMessage, getPublicClient } from 'wagmi/actions'
import { parseEther } from 'viem'

import { hashObject } from '@/utils/functions'
import { ConnectKitButton } from 'connectkit'
import { callAxiosBackend } from '@/utils/general-api'

const contractABI = JSON.parse(
  '[	{		"inputs": [			{				"internalType": "uint256",				"name": "amount",				"type": "uint256"			},			{				"internalType": "address",				"name": "recipient",				"type": "address"			}		],		"name": "adminWithdraw",		"outputs": [],		"stateMutability": "nonpayable",		"type": "function"	},	{		"inputs": [],		"name": "deposit",		"outputs": [],		"stateMutability": "payable",		"type": "function"	},	{		"inputs": [			{				"internalType": "address",				"name": "_admin",				"type": "address"			}		],		"stateMutability": "nonpayable",		"type": "constructor"	},	{		"anonymous": false,		"inputs": [			{				"indexed": true,				"internalType": "address",				"name": "recipient",				"type": "address"			},			{				"indexed": false,				"internalType": "uint256",				"name": "amount",				"type": "uint256"			}		],		"name": "AdminWithdrawn",		"type": "event"	},	{		"anonymous": false,		"inputs": [			{				"indexed": true,				"internalType": "uint256",				"name": "depositId",				"type": "uint256"			},			{				"indexed": true,				"internalType": "address",				"name": "user",				"type": "address"			},			{				"indexed": false,				"internalType": "uint256",				"name": "amount",				"type": "uint256"			},			{				"indexed": false,				"internalType": "uint256",				"name": "timestamp",				"type": "uint256"			}		],		"name": "Deposited",		"type": "event"	},	{		"inputs": [],		"name": "admin",		"outputs": [			{				"internalType": "address",				"name": "",				"type": "address"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [],		"name": "currentDepositId",		"outputs": [			{				"internalType": "uint256",				"name": "",				"type": "uint256"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [			{				"internalType": "uint256",				"name": "",				"type": "uint256"			}		],		"name": "depositById",		"outputs": [			{				"internalType": "address",				"name": "user",				"type": "address"			},			{				"internalType": "uint256",				"name": "amount",				"type": "uint256"			},			{				"internalType": "uint256",				"name": "timestamp",				"type": "uint256"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [],		"name": "getBalance",		"outputs": [			{				"internalType": "uint256",				"name": "",				"type": "uint256"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [			{				"internalType": "uint256",				"name": "depositId",				"type": "uint256"			}		],		"name": "getDeposit",		"outputs": [			{				"internalType": "address",				"name": "user",				"type": "address"			},			{				"internalType": "uint256",				"name": "amount",				"type": "uint256"			},			{				"internalType": "uint256",				"name": "timestamp",				"type": "uint256"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [			{				"internalType": "address",				"name": "user",				"type": "address"			}		],		"name": "getUserDepositIds",		"outputs": [			{				"internalType": "uint256[]",				"name": "",				"type": "uint256[]"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [],		"name": "totalDeposits",		"outputs": [			{				"internalType": "uint256",				"name": "",				"type": "uint256"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [			{				"internalType": "address",				"name": "",				"type": "address"			},			{				"internalType": "uint256",				"name": "",				"type": "uint256"			}		],		"name": "userDepositIds",		"outputs": [			{				"internalType": "uint256",				"name": "",				"type": "uint256"			}		],		"stateMutability": "view",		"type": "function"	}]',
) // Add the ABI you provided
const contractAddress = '0xe2A4F6Cae191e6e599488E1e2C95861312Df9826'
const EXPECTED_CHAIN_ID = 11155111 // Set your expected chain ID

function AddCreditsInput({ onClose }) {
  const config = useConfig()
  const { address, chain } = useAccount()

  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [transactionSuccess, setTransactionSuccess] = useState(false)

  async function handleDeposit() {
    setIsLoading(true)
    try {
      console.log('the chain to create transaction')
      console.log(chain)
      const result = await writeContract(config, {
        address: contractAddress as `0x${string}`,
        args: [], // Required empty array for functions with no args
        abi: contractABI,
        functionName: 'deposit',
        account: address, // Add current user's address
        value: parseEther(amount),
        chain,
      })

      toast.success('Transaction submitted')
      onClose()
    } catch (err) {
      toast.error('Failed to send transaction')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in ETH"
          className="w-24 rounded-md border-[1px] bg-gray/30 px-2  py-1 text-black"
          min="0"
          step="0.01"
        />
        <button
          onClick={handleDeposit}
          disabled={isLoading || !amount}
          className="rounded-md border-[1px] border-gray/50 bg-white px-2 py-1 text-black disabled:opacity-50"
        >
          {isLoading ? 'Confirming...' : 'Confirm'}
        </button>
      </div>
      {!transactionSuccess && (
        <a
          href="https://dashboard.internetcomputer.org/canister/bv7br-xyaaa-aaaam-ac4uq-cai"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-xs text-blue/70 hover:underline"
        >
          Validate transaction on ICP Dashboard
        </a>
      )}
    </div>
  )
}

const Header = () => {
  // Navbar toggle
  const config = useConfig()

  const [navbarOpen, setNavbarOpen] = useState(false)
  const [userNavbarOpen, setUserNavbarOpen] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [userConnected, setUserConnected] = useState()
  const [showAddCredits, setShowAddCredits] = useState(false)

  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen)
  }

  const {
    user,
    setUser,
    setIsWorkspace,
    setIsEditingXnode,
    setXnodeType,
    setFinalNodes,
    sidebarOpen,
    setSidebarOpen,
    credits,
    setCredits,
  } = useContext(AccountContext)

  const sidebarToggleHandler = () => {
    setSidebarOpen(!sidebarOpen)
  }

  async function checkAndRequestSignature(address: string) {
    console.log('check and request signature testado')
    try {
      // First check if address is already signed
      const res = await callAxiosBackend(
        'get',
        `/dooor/is_whitelisted?address=${address}`,
        null,
      )

      if (!res) {
        // Request signature from user
        const signature = await signMessage(config, {
          message: 'create-account-dooor',
          account: address as `0x${string}`, // Precisamos fazer o cast para o tipo correto
        })

        // Verify signature
        await callAxiosBackend('post', '/dooor/verify_signature', null, {
          signature,
        })
      }
    } catch (err) {
      console.error('Error in signature flow:', err)
      console.log(err)
      toast.error('Error verifying wallet signature')
    }
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const pathname = usePathname()
  const isFAQPage = pathname.includes('/faqs')
  const { push } = useRouter()

  const cookies = parseCookies()
  const userHasAnyCookie = cookies.userSessionToken
  const userNavbarRef = useRef(null)

  const tagsOptions = [
    'Decentralized data infrastructure',
    'Dapps',
    'Analysis engine',
    'Research and development',
    'Validator',
  ]

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1)
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1)
    } else {
      setOpenIndex(index)
    }
  }

  function onClickTrans(element: string) {
    const taskStartElement = document.getElementById(element)
    taskStartElement.scrollIntoView({ behavior: 'smooth' })
  }

  function signOutUser() {
    destroyCookie(undefined, 'userSessionToken')
    setUser(null)
    window.location.reload()
  }

  const headerItens = [
    {
      label: 'About',
      href: `https://accelar.io`,
    },
    {
      label: 'Use cases',
      href: `https://accelar.io`,
    },
    {
      label: 'Docs',
      href: `https://docs.accelar.io`,
    },
  ]

  async function getUserData() {
    const { userSessionToken } = parseCookies()
    if (userSessionToken) {
      const config = {
        method: 'post' as 'post',
        url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/openmesh-experts/functions/getCurrentUser`,
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': userSessionToken,
          'Content-Type': 'application/json',
        },
      }
      let dado

      await axios(config).then(function (response) {
        if (response.data) {
          dado = response.data
          setUser(dado)
        }
      })
    }
  }

  useEffect(() => {
    if (userHasAnyCookie) {
      try {
        console.log('getting the user data')
        getUserData()
      } catch (err) {
        console.log('eroror getting the user session token')
        destroyCookie(undefined, 'userSessionToken')
        setUser(null)
      }
    } else {
      localStorage.removeItem('@scalable: user-state-1.0.0')
      destroyCookie(undefined, 'userSessionToken')
      setUser(null)
    }

    const savedNodes = localStorage.getItem('nodes')
    const savedEdges = localStorage.getItem('edges')
    if (savedNodes && savedEdges) {
      setIsWorkspace(true)
    }

    const savedXnodeType = localStorage.getItem('xnodeType')

    setXnodeType(savedXnodeType)

    const isEditingX = localStorage.getItem('editingNode')
    if (isEditingX) {
      setIsEditingXnode(true)
    }

    setFinalNodes(JSON.parse(savedNodes))
  }, [])

  async function getUserNonce(userAddress: string) {
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/openmesh-experts/functions/getUserNonce`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        address: userAddress,
      },
    }
    let dado

    await axios(config).then(function (response) {
      if (response.data) {
        dado = response.data
      }
    })
    return dado
  }

  async function fetchUserCredits(addressCheck: string) {
    try {
      const response = await axios(
        `http://provider.europlots.com:31584/admin/user_credits/${addressCheck}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer sua_chave_api_aqui',
          },
        },
      )

      if (!response) {
        throw new Error('Failed to fetch credits')
      }

      const data = await response.data
      return data
    } catch (error) {
      console.error('Error fetching credits:', error)
      return null
    }
  }

  async function loginWeb3User(userAddress: string, signature: string) {
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/openmesh-experts/functions/loginByWeb3Address`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
      },
      data: {
        address: userAddress,
        signature,
      },
    }

    let dado

    await axios(config).then(function (response) {
      if (response.data) {
        dado = response.data
      }
    })

    return dado
  }

  const { address, isConnecting, isDisconnected } = useAccount()

  useEffect(() => {
    async function getWeb3Login() {
      if (address && !user && !userHasAnyCookie) {
        // trying web3 login
        try {
          let nonceUser = await getUserNonce(address)
          nonceUser = nonceUser || '0'
          const hash = hashObject(`${address}-${nonceUser}`)
          console.log('message to hash')
          console.log(hash)
          const finalHash = `0x${hash}`
          // const signature = await signMessage({
          //   message: finalHash,
          // })
          const res = await loginWeb3User(address, `signature`)
          setCookie(null, 'userSessionToken', res.sessionToken)
          nookies.set(null, 'userSessionToken', res.sessionToken)
          setUser(res)
        } catch (err) {
          toast.error(err)
          console.log('error loging user')
        }
      }
    }
    getWeb3Login()
  }, [address])

  useEffect(() => {
    async function handleAddressChange() {
      if (address) {
        console.log('entrei em handle address change')
        await checkAndRequestSignature(address)

        const credits = await fetchUserCredits(address)
        console.log('recebi de credits')
        console.log(credits)
        if (credits?.remaining_credits) {
          setCredits(credits)
        }
      }
    }
    handleAddressChange()
  }, [address])

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       userNavbarRef.current &&
  //       !userNavbarRef.current.contains(event.target)
  //     ) {
  //       setUserNavbarOpen(false)
  //     }
  //   }

  //   // Adiciona o event listener ao document
  //   document.addEventListener('mousedown', handleClickOutside)

  //   // Cleanup function para remover o event listener
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [])

  return (
    <>
      <header className="top-0 left-0 z-40 mx-0 w-full items-center bg-[#fff] px-[17px] pt-[7px]  text-[#000000] xl:px-[43px] xl:pt-[20px] xl:pb-[16px]">
        <div className="flex">
          <div className="w-full justify-between py-[20px] px-[20px] md:px-[33px] lg:hidden">
            <button
              onClick={sidebarToggleHandler}
              id="navbarToggler"
              aria-label="Mobile Menu"
              className="absolute left-4 top-1 block  rounded-lg px-3 py-[6px] ring-primary focus:ring-2"
            >
              <span
                className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300  ${
                  sidebarOpen ? ' top-[7px] rotate-45' : ' '
                }`}
              />
              <span
                className={`relative my-1.5 block h-0.5 w-[15px] bg-black transition-all duration-300 ${
                  sidebarOpen ? 'w-[30px] opacity-0' : ' '
                }`}
              />
              <span
                className={`relative my-1.5 block h-0.5 w-[10px] bg-black transition-all duration-300  ${
                  sidebarOpen ? ' top-[-8px] w-[30px] -rotate-45' : ' '
                }`}
              />
            </button>
            <button
              onClick={navbarToggleHandler}
              id="navbarToggler"
              aria-label="Mobile Menu"
              className="absolute right-4 top-1 block  rounded-lg px-3 py-[6px] ring-primary focus:ring-2"
            >
              <span
                className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300  ${
                  navbarOpen ? ' top-[7px] rotate-45' : ' '
                }`}
              />
              <span
                className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 ${
                  navbarOpen ? 'opacity-0 ' : ' '
                }`}
              />
              <span
                className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300  ${
                  navbarOpen ? ' top-[-8px] -rotate-45' : ' '
                }`}
              />
            </button>
            <nav
              id="navbarCollapse"
              className={`navbar absolute right-7 z-50 w-[200px] rounded border-[.5px] bg-[#e6e4e4] py-6  px-6 text-[13px] text-[#fff] duration-300  ${
                navbarOpen
                  ? 'visibility top-20 opacity-100'
                  : 'invisible top-20 opacity-0'
              }`}
            >
              <div className=" grid gap-y-[15px] text-[12px]  font-medium !leading-[19px]">
                <div className="my-auto grid gap-y-[20px] text-center text-black/80 md:justify-center">
                  {headerItens.map((option, index) => (
                    <a
                      key={index}
                      href={`${option.href}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="text-[#313131]">{option.label}</div>
                    </a>
                  ))}
                  <div className="grid gap-y-[12px] font-medium">
                    {userHasAnyCookie ? (
                      <div className="my-auto">
                        <img
                          src={
                            !user?.profilePictureHash
                              ? `${
                                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                                    ? process.env.NEXT_PUBLIC_BASE_PATH
                                    : ''
                                }/images/lateralNavBar/profile2.svg`
                              : `https://cloudflare-ipfs.com/ipfs/${user.profilePictureHash}`
                          }
                          alt="image"
                          onClick={(e) => {
                            e.stopPropagation()
                            setUserNavbarOpen(true)
                          }}
                          className={`my-auto mr-[25px] mt-[15px] w-[20px]`}
                        />
                        <nav
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                          ref={userNavbarRef}
                          className={`navbar  absolute left-[0px] z-50 flex w-[150px] rounded-[8px] border-[.5px] bg-[#e6e4e4] pt-[19px] pr-1 pl-[15px] pb-[30px] text-[13px] text-[#fff] duration-300  ${
                            userNavbarOpen
                              ? 'visibility -bottom-[120px] -right-[50px] opacity-100'
                              : 'invisible -bottom-[120px] opacity-0'
                          }`}
                        >
                          <div className="mt-[10px]">
                            <div className="mt-[25px]">
                              <a
                                onClick={(e) => {
                                  e.stopPropagation()
                                  signOutUser()
                                }}
                                className=" cursor-pointer items-center rounded-[5px] border  border-[#000] bg-transparent py-[6px] px-[18px] text-[12px] font-bold !leading-[19px] text-[#575757] hover:bg-[#ececec]"
                              >
                                Sign out
                              </a>
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              setUserNavbarOpen(false)
                            }}
                            className="ml-[20px] flex  h-fit cursor-pointer justify-end text-[16px] font-bold text-[#000] hover:text-[#313131]"
                          >
                            x
                          </div>
                        </nav>
                      </div>
                    ) : (
                      <a
                        href={`${
                          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                            ? `/pythia/login`
                            : `${'/login'}`
                        }`}
                        className=" my-auto mx-auto mt-[10px] h-fit w-fit cursor-pointer items-center   border-b  border-[#000] bg-transparent text-[16px]  font-bold !leading-[19px] text-[#000] hover:text-[#3b3a3a]"
                      >
                        Login
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          </div>
          <div className="relative mx-auto mb-[20px] hidden h-full w-full max-w-[1800px] items-center  justify-between lg:flex">
            <div className="relative ml-auto flex gap-x-[25px] text-[7px] md:gap-x-[30px] md:text-[8.4px] lg:gap-x-[35px]  lg:text-[10px]  xl:gap-x-[40px] xl:text-[11.2px] 2xl:gap-x-[50px] 2xl:text-[14px]">
              {/* <div className="">
                <div className="text-[7px] font-light md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                  Estimated monthly price*
                </div>
                <div className="text-[13px] font-medium md:text-[15.5px] lg:text-[18px] xl:text-[21px] 2xl:text-[26px]">
                  $<span className="font-bold">40</span> / month
                </div>
                <div className="mt-[5px] flex justify-between">
                  <div className="text-[7px] text-[#12AD50]  md:text-[8.4px]  lg:text-[10px]  xl:text-[11.2px] 2xl:text-[14px]">
                    ~$13,000 savings
                  </div>
                  <img
                    src={`/images/header/question.svg`}
                    alt="image"
                    className="mb-[5px] w-[6.5px]  md:w-[7.8px]  lg:w-[9.1px] xl:w-[10.4px] 2xl:w-[13px]"
                  />
                </div>
              </div> */}
              <div className="text-black">
                {address && (
                  <div className="flex gap-x-2">
                    <div>Credits: {1000}</div>
                    {showAddCredits ? (
                      <AddCreditsInput
                        onClose={() => setShowAddCredits(false)}
                      />
                    ) : (
                      <button
                        onClick={() => setShowAddCredits(true)}
                        className="text-blue-500 hover:underline"
                      >
                        Add more
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-x-[15px] font-medium text-[#000] md:gap-x-[18px] lg:gap-x-[21px] xl:gap-x-[24px] 2xl:gap-x-[30px]">
                {headerItens.map((option, index) => (
                  <a
                    onClick={() => {
                      fetchUserCredits(address)
                    }}
                    key={index}
                    href={`${option.href}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="hover:text-[#313131]">{option.label}</div>
                  </a>
                ))}
              </div>

              <div className="flex items-center">
                <ConnectKitButton.Custom>
                  {({ isConnected, show, truncatedAddress, ensName }) => {
                    return (
                      <button
                        onClick={show}
                        className="rounded-md border-[1px] border-black/40 bg-white px-3 py-1 text-sm font-medium text-black/80 hover:bg-gray/10 "
                      >
                        {isConnected
                          ? ensName ?? truncatedAddress
                          : 'Connect Wallet'}
                      </button>
                    )
                  }}
                </ConnectKitButton.Custom>{' '}
              </div>
            </div>
            {/* <div className="lg:hidden">
            <Dialog.Root>
              <Dialog.Trigger>
                <List className="text-black" size={24} weight="bold" />
              </Dialog.Trigger>
              <HeaderModal navigationItems={navigationItems} />
            </Dialog.Root>
          </div> */}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
