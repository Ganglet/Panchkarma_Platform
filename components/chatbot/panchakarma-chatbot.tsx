'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Helper function to format AI responses with truncation
const formatAIResponse = (text: string, isExpanded: boolean = false) => {
  // If not expanded and text is long, truncate it
  const displayText = !isExpanded && text.length > 300 ? text.substring(0, 300) + '...' : text
  
  // Split by double newlines to create paragraphs
  const paragraphs = displayText.split('\n\n')
  
  return paragraphs.map((paragraph, index) => {
    const trimmedParagraph = paragraph.trim()
    
    // Check if it's a bullet point or numbered list
    if (trimmedParagraph.startsWith('*') || trimmedParagraph.startsWith('-')) {
      const lines = trimmedParagraph.split('\n')
      return (
        <ul key={index} className="list-disc list-inside space-y-1 my-2 ml-4">
          {lines.map((line, lineIndex) => (
            <li key={lineIndex} className="text-sm leading-relaxed">
              {formatBoldText(line.replace(/^[\*\-\s]+/, ''))}
            </li>
          ))}
        </ul>
      )
    }
    
    // Check if it's a numbered list
    if (trimmedParagraph.match(/^\d+\./)) {
      const lines = trimmedParagraph.split('\n')
      return (
        <ol key={index} className="list-decimal list-inside space-y-1 my-2 ml-4">
          {lines.map((line, lineIndex) => (
            <li key={lineIndex} className="text-sm leading-relaxed">
              {formatBoldText(line.replace(/^\d+\.\s*/, ''))}
            </li>
          ))}
        </ol>
      )
    }
    
    // Check if it's a heading (starts with ** or ##)
    if (trimmedParagraph.startsWith('**') && trimmedParagraph.endsWith('**')) {
      return (
        <h3 key={index} className="text-sm font-semibold my-3 text-gray-800">
          {trimmedParagraph.replace(/\*\*/g, '')}
        </h3>
      )
    }
    
    // Check for markdown-style headings
    if (trimmedParagraph.startsWith('##')) {
      return (
        <h3 key={index} className="text-sm font-semibold my-3 text-gray-800">
          {trimmedParagraph.replace(/^#+\s*/, '')}
        </h3>
      )
    }
    
    // Regular paragraph
    return (
      <p key={index} className="text-sm my-2 leading-relaxed">
        {formatBoldText(trimmedParagraph)}
      </p>
    )
  })
}

// Helper function to format bold text and other markdown
const formatBoldText = (text: string): (string | JSX.Element)[] => {
  // Handle bold text
  let formatted: (string | JSX.Element)[] = text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
  
  // Handle italic text
  formatted = formatted.flatMap((part, index) => {
    if (typeof part === 'string') {
      return part.split(/(\*.*?\*)/g).map((subPart, subIndex) => {
        if (subPart.startsWith('*') && subPart.endsWith('*') && !subPart.startsWith('**')) {
          return (
            <em key={`${index}-${subIndex}`} className="italic">
              {subPart.slice(1, -1)}
            </em>
          )
        }
        return subPart
      })
    }
    return part
  })
  
  return formatted
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: Array<{
    content: string
    metadata: any
  }>
  isExpanded?: boolean
}

interface ChatbotProps {
  onClose?: () => void
}

export function PanchakarmaChatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Check if there are existing messages in sessionStorage
    if (typeof window !== 'undefined') {
      const savedMessages = sessionStorage.getItem('panchakarma-chat-messages')
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages)
          // Convert timestamp strings back to Date objects
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        } catch (e) {
          console.error('Error parsing saved messages:', e)
        }
      }
    }
    
    // Default welcome message
    return [
      {
        id: '1',
        type: 'assistant',
        content: 'Namaste! I\'m your Panchakarma AI Assistant. I can help you understand Panchakarma therapies, their benefits, procedures, and answer any questions you have about Ayurvedic treatments. How can I assist you today?',
        timestamp: new Date()
      }
    ]
  })
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesTopRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const scrollToTop = () => {
    // Scroll the top anchor into view within the scrollable container
    if (messagesTopRef.current) {
      messagesTopRef.current.scrollIntoView({ behavior: 'auto', block: 'start' })
    } else if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0
    }
  }

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('panchakarma-chat-messages', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle scroll events to show/hide scroll to top button
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current
    if (!messagesContainer) return

    const handleScroll = () => {
      const { scrollTop } = messagesContainer
      setShowScrollToTop(scrollTop > 100)
    }

    messagesContainer.addEventListener('scroll', handleScroll)
    return () => messagesContainer.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Home or Cmd+Home to scroll to top
      if ((event.ctrlKey || event.metaKey) && event.key === 'Home') {
        event.preventDefault()
        scrollToTop()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputValue }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        sources: data.sources
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleMessageExpansion = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isExpanded: !msg.isExpanded }
        : msg
    ))
  }

  const clearChat = () => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'assistant',
      content: 'Namaste! I\'m your Panchakarma AI Assistant. I can help you understand Panchakarma therapies, their benefits, procedures, and answer any questions you have about Ayurvedic treatments. How can I assist you today?',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto relative messages-container"
        style={{ 
          maxHeight: 'calc(100vh - 200px)',
          minHeight: '400px',
          scrollBehavior: 'auto',
          overflowY: 'scroll'
        }}
      >
        <div ref={messagesTopRef} />
        <div className="p-4 space-y-4 pb-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              data-message-id={message.id}
              data-message-index={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-3 max-w-[85%] ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`rounded-lg px-4 py-3 max-w-full ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="break-words">
                    {message.type === 'assistant' ? (
                      <div>
                        {formatAIResponse(message.content, message.isExpanded)}
                        {message.content.length > 300 && (
                          <button
                            onClick={() => toggleMessageExpansion(message.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-2 underline block w-full text-left"
                          >
                            {message.isExpanded ? 'Show Less' : 'Show More'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  

                  {/* Timestamp */}
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm text-gray-600">Thinking...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
        
        {/* Removed scroll-to-top button */}
      </div>

      {/* Input Area */}
      <div className="border-t p-4 flex-shrink-0 bg-white">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about Panchakarma therapy..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Questions */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "What is Panchakarma?",
              "Tell me about Vamana therapy",
              "What is Basti treatment?",
              "How does Nasya work?"
            ].map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(question)}
                className="text-xs h-7"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
