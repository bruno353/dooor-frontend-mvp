'use client'
import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

const LottiePlayer = dynamic(() => import('react-lottie-player'), {
  ssr: false,
})

const QueryFlowAnimation = ({ isLoading }) => {
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 4)
      }, 3500)
      return () => clearInterval(interval)
    } else {
      setAnimationStep(0)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="mx-auto flex items-center justify-center">
      <div className="w-[600px] rounded-xl bg-white p-6 shadow-lg">
        <div className="relative h-[250px]">
          {/* User Query Node */}
          <div
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-opacity duration-500 ${
              animationStep === 0 ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/50">
              <div className="text-center">
                <div className="font-bold text-primary/60">User</div>
                <div className="mt-1 text-xs text-primary/40">Query</div>
              </div>
            </div>
          </div>

          {/* Query to ICP Arrow */}
          <div
            className={`absolute left-[25%] top-1/2 z-10 -translate-y-1/2 transition-opacity duration-500 ${
              animationStep === 0 ? 'opacity-100' : 'opacity-10'
            }`}
          >
            {typeof window !== 'undefined' && (
              <LottiePlayer
                loop
                animationData={require('./arrow.json')}
                play
                style={{ width: '50px', height: 'auto' }}
              />
            )}
          </div>

          {/* ICP Node */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
              animationStep === 1 ? 'opacity-100' : 'opacity-20'
            }`}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple/50">
              <div className="text-center">
                <div className="font-bold text-purple/60">ICP</div>
                <div className="mt-1 text-xs text-purple/40">Validation</div>
              </div>
            </div>
          </div>

          {/* ICP to Akash Arrow */}
          <div
            className={`absolute left-[65%] top-1/2 z-10 -translate-y-1/2 transition-opacity duration-500 ${
              animationStep === 1 ? 'opacity-100' : 'opacity-10'
            }`}
          >
            {typeof window !== 'undefined' && (
              <LottiePlayer
                loop
                animationData={require('./arrow.json')}
                play
                style={{ width: '50px', height: 'auto' }}
              />
            )}
          </div>

          {/* Akash Node */}
          <div
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-500 ${
              animationStep === 2 ? 'opacity-100' : 'opacity-20'
            }`}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red/50">
              <div className="text-center">
                <div className="font-bold text-red/60">Akash</div>
                <div className="mt-1 text-xs text-red/40">Processing</div>
              </div>
            </div>
          </div>

          {/* Akash to Query Return Arrow */}
          <div
            className={`absolute left-1/2 top-[70%] z-10 -translate-x-1/2 transition-opacity duration-500 ${
              animationStep === 2 ? 'opacity-100' : 'opacity-10'
            }`}
          >
            {typeof window !== 'undefined' && (
              <LottiePlayer
                loop
                animationData={require('./curve-arrow.json')}
                play
                style={{
                  width: '250px',
                  height: 'auto',
                  transform: 'rotate(190deg)',
                }}
              />
            )}
          </div>

          {/* Hash Information */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-8 text-xs text-gray/50">
            <div>ICP Hash: {`0x${Math.random().toString(16).slice(2, 8)}`}</div>
            <div>
              Akash Hash: {`0x${Math.random().toString(16).slice(2, 8)}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueryFlowAnimation
