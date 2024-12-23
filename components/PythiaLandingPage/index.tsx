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
  return <ChatComponent mode="landing" />
}

export default PythiaLandingPage
