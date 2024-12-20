import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const ModelSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState('000 1.0.1')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const models = [
    { id: 1, name: '000 1.0.1', description: 'Stable release', soon: false },
    { id: 2, name: '000 1.0.2', description: 'Beta version', soon: false },
    {
      id: 3,
      name: 'Apolis 1.0.0',
      description: 'Trading agent',
      soon: true,
    },
    {
      id: 4,
      name: 'PumpMeme 0.1',
      description: 'Experimental agent',
      soon: true,
    },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-gray/10"
      >
        <span className="text-black">{selectedModel}</span>
        <ChevronDown
          className={`text-gray-400 h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 rounded-md border border-gray/20 bg-white py-1 shadow-lg">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                if (!model.soon) {
                  setSelectedModel(model.name)
                  setIsOpen(false)
                }
              }}
              disabled={model.soon}
              className={`relative w-full px-4 py-2 text-left transition-colors ${
                model.soon
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-gray/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-black">
                  {model.name}
                </div>
                {model.soon && (
                  <span className="text-gray-500 rounded bg-gray/10 px-1.5 py-0.5 text-[10px] font-medium">
                    Soon
                  </span>
                )}
              </div>
              <div className="text-xs text-gray/80">{model.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ModelSelector
