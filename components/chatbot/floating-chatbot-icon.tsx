'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Trash2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PanchakarmaChatbot } from './panchakarma-chatbot'

interface FloatingChatbotIconProps {
  userType?: string
}

export function FloatingChatbotIcon({ userType }: FloatingChatbotIconProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Only show for patients
  if (userType !== 'patient') {
    return null
  }

  return (
    <>
      {/* Floating Chatbot Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
            "shadow-lg hover:shadow-xl transition-all duration-300",
            "flex items-center justify-center",
            "animate-pulse hover:animate-none"
          )}
          size="icon"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </Button>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Ask about Panchakarma
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* Chatbot Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Close modal when clicking on the backdrop
            if (e.target === e.currentTarget) {
              setIsOpen(false)
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] max-h-[900px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg flex-shrink-0">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Panchakarma AI Assistant</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem('panchakarma-chat-messages')
                    }
                    window.location.reload()
                  }}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  title="Clear chat history"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  title="Minimize chat"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  title="Close chat"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Chatbot Content */}
            <div className="flex-1">
              <PanchakarmaChatbot onClose={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
