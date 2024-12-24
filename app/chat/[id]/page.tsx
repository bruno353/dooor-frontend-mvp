'use client'

import ChatPage from '@/components/Chat'

// eslint-disable-next-line no-unused-vars

export default function Page({ params }) {
  return (
    <>
      {/* <ScrollUp /> */}
      <div className="h-[calc(100vh-6rem)] w-full">
        <ChatPage id={params.id} />
      </div>
    </>
  )
}
