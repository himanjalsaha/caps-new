'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  if (!isOpen && !isClosing) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div
        ref={modalRef}
        className={`bg-[#242526] rounded-lg shadow-xl w-full max-w-md transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 id="modal-title" className="text-xl font-semibold text-white">
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}