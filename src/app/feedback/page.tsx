'use client'

import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { MessageSquare, Send, CheckCircle } from 'lucide-react'

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', message: '' })
      } else {
        const data = await response.json()
        setError(data.error || '提交失败，请稍后再试')
      }
    } catch (err) {
      setError('网络错误，请检查您的连接')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">反馈提交成功</h1>
            <p className="text-gray-600 mb-6">
              感谢您的反馈！我们会认真审阅您的建议，并在必要时与您联系。
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              提交新反馈
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">意见反馈</h1>
          <p className="text-gray-600">
            您的反馈对我们非常重要，帮助我们改进产品和服务
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入您的姓名"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱地址
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入您的邮箱地址"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                反馈内容
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请详细描述您的问题、建议或意见..."
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {loading ? '提交中...' : '提交反馈'}
            </button>
          </form>
        </div>

        {/* Feedback Guidelines */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">反馈指南</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• <strong>功能建议：</strong>告诉我们您希望看到的新功能</p>
            <p>• <strong>错误报告：</strong>详细描述您遇到的问题和重现步骤</p>
            <p>• <strong>用户体验：</strong>分享您的使用感受和改进建议</p>
            <p>• <strong>内容反馈：</strong>对AI推荐质量和准确性的意见</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}