'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import { Plus, Edit3, Trash2, Star, BookOpen, Search } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  description?: string
  genre?: string
  status: 'unread' | 'reading' | 'read'
  rating: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const { token } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    genre: '',
    status: 'unread',
    rating: 0,
    notes: ''
  })

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
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingBook ? `/api/books/${editingBook.id}` : '/api/books'
      const method = editingBook ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          rating: parseInt(formData.rating.toString()) || 0
        })
      })

      if (response.ok) {
        await fetchBooks()
        setShowAddForm(false)
        setEditingBook(null)
        setFormData({
          title: '',
          author: '',
          isbn: '',
          description: '',
          genre: '',
          status: 'unread',
          rating: 0,
          notes: ''
        })
      }
    } catch (error) {
      console.error('Failed to save book:', error)
    }
  }

  const handleEdit = (book: Book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      description: book.description || '',
      genre: book.genre || '',
      status: book.status,
      rating: book.rating,
      notes: book.notes || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (bookId: string) => {
    if (confirm('确定要删除这本书吗？')) {
      try {
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          await fetchBooks()
        }
      } catch (error) {
        console.error('Failed to delete book:', error)
      }
    }
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const statusColors = {
    unread: 'bg-gray-100 text-gray-800',
    reading: 'bg-blue-100 text-blue-800',
    read: 'bg-green-100 text-green-800'
  }

  const statusLabels = {
    unread: '未读',
    reading: '正在阅读',
    read: '已读'
  }

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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">我的图书</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加图书
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索图书..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有状态</option>
            <option value="unread">未读</option>
            <option value="reading">正在阅读</option>
            <option value="read">已读</option>
          </select>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">作者：{book.author}</p>
                  {book.genre && (
                    <p className="text-sm text-gray-500 mb-2">类型：{book.genre}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[book.status]}`}>
                    {statusLabels[book.status]}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">{book.rating}/5</span>
                  </div>
                </div>

                {book.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无图书</h3>
            <p className="text-gray-500 mb-4">开始添加您的第一本书吧！</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              添加图书
            </button>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingBook ? '编辑图书' : '添加新图书'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    书名 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    作者 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    类型
                  </label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({...formData, genre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="unread">未读</option>
                    <option value="reading">正在阅读</option>
                    <option value="read">已读</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    评分 (0-5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    简介
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    笔记
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingBook(null)
                      setFormData({
                        title: '',
                        author: '',
                        isbn: '',
                        description: '',
                        genre: '',
                        status: 'unread',
                        rating: 0,
                        notes: ''
                      })
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingBook ? '更新' : '添加'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}