/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use client'

import AccountContextProvider from '@/contexts/AccountContext'
import { ThemeProvider } from 'next-themes'
import { ToastContainer } from 'react-toastify'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, useWeb3ModalTheme } from '@web3modal/react'
import { arbitrum, mainnet, polygon, polygonMumbai } from 'wagmi/chains'
import { Web3Provider } from './Web3Provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Web3Provider>
        <AccountContextProvider>
          <ThemeProvider
            attribute="class"
            enableSystem={false}
            defaultTheme="dark"
          >
            {children}
          </ThemeProvider>
        </AccountContextProvider>
      </Web3Provider>

      <ToastContainer />
    </>
  )
}
