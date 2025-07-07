'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import { BookOpen, TrendingUp, Star, Clock, Plus, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface Book {
  id: string
  title: string
  author: string
  status: 'unread' | 'reading' | 'read'
  rating: number
  createdAt: string
}

interface Stats {
  totalBooks: number
  readBooks: number
  readingBooks: number
  unreadBooks: number
  averageRating: number
}

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    readBooks: 0,
    readingBooks: 0,
    unreadBooks: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()

  useEffect(() => {
    fetchBooks()
  }, [])

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
        calculateStats(data.books)
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (bookList: Book[]) => {
    const totalBooks = bookList.length
    const readBooks = bookList.filter(book => book.status === 'read').length
    const readingBooks = bookList.filter(book => book.status === 'reading').length
    const unreadBooks = bookList.filter(book => book.status === 'unread').length
    
    const ratedBooks = bookList.filter(book => book.rating > 0)
    const averageRating = ratedBooks.length > 0 
      ? ratedBooks.reduce((sum, book) => sum + book.rating, 0) / ratedBooks.length 
      : 0

    setStats({
      totalBooks,
      readBooks,
      readingBooks,
      unreadBooks,
      averageRating
    })
  }

  const recentBooks = books.slice(0, 5)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            欢迎回来，{user?.name || user?.email}！
          </h1>
          <p className="text-blue-100">
            继续您的阅读之旅，探索知识的世界
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总图书数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已读完成</p>
                <p className="text-2xl font-bold text-gray-900">{stats.readBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">正在阅读</p>
                <p className="text-2xl font-bold text-gray-900">{stats.readingBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">平均评分</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/books"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">添加图书</h3>
                <p className="text-sm text-gray-600">快速添加新的图书到您的收藏</p>
              </div>
            </div>
          </Link>

          <Link
            href="/ai-assistant"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">AI助手</h3>
                <p className="text-sm text-gray-600">获取个性化的阅读建议和推荐</p>
              </div>
            </div>
          </Link>

          <Link
            href="/books"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">浏览图书</h3>
                <p className="text-sm text-gray-600">管理您的图书收藏和阅读进度</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Books */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">最近添加的图书</h2>
              <Link
                href="/books"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                查看全部
              </Link>
            </div>
          </div>
          
          {recentBooks.length > 0 ? (
            <div className="p-6">
              <div className="space-y-4">
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-600">作者：{book.author}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        book.status === 'read' ? 'bg-green-100 text-green-800' :
                        book.status === 'reading' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {book.status === 'read' ? '已读' : 
                         book.status === 'reading' ? '正在阅读' : '未读'}
                      </span>
                      {book.rating > 0 && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">{book.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">还没有图书</h3>
              <p className="text-gray-500 mb-4">开始添加您的第一本书吧！</p>
              <Link
                href="/books"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加图书
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}