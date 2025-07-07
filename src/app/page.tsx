'use client'

import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BookOpen, Users, Brain, Star, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">智能图书管理</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                注册
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              智能图书管理系统
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              AI驱动的个人图书管理和推荐系统
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                开始使用
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/auth/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                登录账户
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              强大的功能特性
            </h2>
            <p className="text-xl text-gray-600">
              一站式图书管理，AI智能推荐，让阅读更加高效
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                图书管理
              </h3>
              <p className="text-gray-600">
                轻松添加、编辑和管理您的个人图书收藏，支持多种状态跟踪和评分系统
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI智能助手
              </h3>
              <p className="text-gray-600">
                基于您的阅读历史，AI助手为您推荐合适的书籍，并回答关于书籍的问题
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                个性化推荐
              </h3>
              <p className="text-gray-600">
                根据您的阅读偏好和历史记录，提供个性化的图书推荐和阅读建议
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                为什么选择我们？
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">简单易用</h3>
                    <p className="text-gray-600">直观的界面设计，轻松管理您的图书收藏</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">AI智能</h3>
                    <p className="text-gray-600">先进的AI技术，提供个性化推荐和阅读建议</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">数据安全</h3>
                    <p className="text-gray-600">您的个人数据受到严格保护，安全可靠</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">持续更新</h3>
                    <p className="text-gray-600">定期更新功能，持续改善用户体验</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  1000+
                </h3>
                <p className="text-gray-600 mb-6">
                  用户信赖的图书管理平台
                </p>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  立即加入
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold">智能图书管理</h3>
              </div>
              <p className="text-gray-400">
                AI驱动的个人图书管理和推荐系统
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">功能特性</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">价格方案</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API文档</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">帮助中心</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
                <li><Link href="/feedback" className="hover:text-white transition-colors">意见反馈</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">关于</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">关于我们</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">服务条款</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 智能图书管理系统. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
