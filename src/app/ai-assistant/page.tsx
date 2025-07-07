'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import { Send, Bot, User, RefreshCw, BookOpen } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Book {
  id: string
  title: string
  author: string
  genre?: string
  status: string
  rating: number
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { token } = useAuth()

  useEffect(() => {
    fetchBooks()
    // Add welcome message
    setMessages([{
      id: '1',
      type: 'assistant',
      content: '您好！我是您的智能图书助手。我可以帮助您：\n\n📚 根据您的阅读历史推荐新书\n🔍 回答关于书籍内容的问题\n📖 提供阅读建议和读书方法\n📝 帮助整理图书信息\n\n请随时向我提问！',
      timestamp: new Date()
    }])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books)
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage,
          context: books.map(book => ({
            title: book.title,
            author: book.author,
            genre: book.genre,
            status: book.status,
            rating: book.rating
          }))
        })
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('Failed to get AI response')
      }
    } catch (error) {
      console.error('AI chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '抱歉，我现在无法回答您的问题。请稍后再试。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: '您好！我是您的智能图书助手。我可以帮助您：\n\n📚 根据您的阅读历史推荐新书\n🔍 回答关于书籍内容的问题\n📖 提供阅读建议和读书方法\n📝 帮助整理图书信息\n\n请随时向我提问！',
      timestamp: new Date()
    }])
  }

  const quickQuestions = [
    '根据我的阅读历史，推荐几本书',
    '如何提高阅读效率？',
    '有什么好的读书方法？',
    '帮我分析一下我的阅读偏好'
  ]

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Bot className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">AI图书助手</h1>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            清空对话
          </button>
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">快速提问：</h3>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                <div className="flex items-start">
                  {message.type === 'assistant' && (
                    <Bot className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  {message.type === 'user' && (
                    <User className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Bot className="w-5 h-5 text-blue-600 mr-2" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="输入您的问题..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Book Context Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center text-sm text-blue-700">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>AI助手已了解您的 {books.length} 本图书信息，可以基于您的阅读历史提供个性化建议</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}