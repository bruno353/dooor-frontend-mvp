import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

export const models = [
  {
    id: 1,
    name: 'ACL 1.0.1',
    tag: 'ACL',
    image: 'images/logo/dooor-logo.svg',
    description: 'Stable release',
    soon: false,
  },
  {
    id: 2,
    name: 'OAT 1.0.2',
    tag: 'OAT',
    image: 'images/logo/dooor-logo.svg',
    description: 'Beta version',
    soon: false,
  },
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

const ModelSelector = ({ onSelect, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState('ACL 1.0.1')
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen)
          }
        }}
        disabled={disabled}
        className="flex items-center gap-x-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-gray/10"
      >
        <span className="text-black">{selectedModel}</span>
        {!disabled && (
          <ChevronDown
            className={`text-gray-400 h-4 w-4 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 rounded-md border border-gray/20 bg-white py-1 shadow-lg">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                if (!model.soon) {
                  setSelectedModel(model.name)
                  onSelect?.(model)
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
