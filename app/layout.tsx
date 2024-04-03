'use client'

// import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import 'node_modules/react-modal-video/css/modal-video.css'
import '../styles/index.css'
import { Providers } from './providers'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useContext } from 'react'
import { AccountContext } from '@/contexts/AccountContext'

export default function RootLayout({
  children,
}: {
  // eslint-disable-next-line no-undef
  children: React.ReactNode
}) {
  const { sidebarOpen } = useContext(AccountContext)
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className="max-w-screen w-full bg-white">
        <Providers>
          <div className="flex">
            <div className={`z-50 h-[calc(100vh)] w-full md:w-fit md:flex-shrink-0 ${!sidebarOpen ? 'hidden' : 'w-full'}`}>
              <Sidebar onValueChange={console.log('')} />
            </div>
            <div
              className={`mx-auto md:flex-grow ${sidebarOpen && 'hidden md:flex-grow'}`}
            >
              <Header />
              {children}
            </div>
          </div>

          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
