'use client'

import DashboardLayout from '../../components/DashboardLayout'
import { HelpCircle, BookOpen, MessageCircle, Settings, Star } from 'lucide-react'

export default function HelpPage() {
  const faqs = [
    {
      question: '如何添加新图书？',
      answer: '在"我的图书"页面点击"添加图书"按钮，填写书名、作者等信息即可添加新图书到您的收藏中。'
    },
    {
      question: 'AI助手如何工作？',
      answer: 'AI助手基于您的阅读历史和偏好，为您提供个性化的图书推荐和阅读建议。您可以随时向AI助手提问。'
    },
    {
      question: '如何修改图书信息？',
      answer: '在图书列表中点击任意图书的编辑按钮，即可修改该图书的详细信息，包括状态、评分、笔记等。'
    },
    {
      question: '如何删除图书？',
      answer: '在图书列表中点击删除按钮，确认后即可删除该图书。删除操作不可恢复，请谨慎操作。'
    },
    {
      question: '图书状态有哪些？',
      answer: '图书状态包括：未读、正在阅读、已读。您可以根据阅读进度随时更新图书状态。'
    },
    {
      question: '如何使用评分功能？',
      answer: '您可以为每本书打1-5星的评分，这有助于AI助手更好地了解您的阅读偏好，提供更准确的推荐。'
    }
  ]

  const features = [
    {
      icon: BookOpen,
      title: '图书管理',
      description: '轻松添加、编辑和管理您的个人图书收藏'
    },
    {
      icon: MessageCircle,
      title: 'AI助手',
      description: '智能推荐和阅读建议，让您的阅读更高效'
    },
    {
      icon: Star,
      title: '评分系统',
      description: '为图书打分，记录您的阅读体验'
    },
    {
      icon: Settings,
      title: '个人设置',
      description: '自定义您的阅读偏好和账户设置'
    }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">帮助中心</h1>
          <p className="text-gray-600">找到您需要的答案，或联系我们获取支持</p>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">功能介绍</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">常见问题</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start">
                  <HelpCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快速入门指南</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
              <span className="text-gray-700">添加您的第一本图书到收藏中</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
              <span className="text-gray-700">为图书设置状态和评分</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
              <span className="text-gray-700">与AI助手对话，获取个性化推荐</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">4</span>
              <span className="text-gray-700">继续添加图书，建立您的阅读档案</span>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">需要更多帮助？</h2>
          <p className="text-gray-600 mb-4">如果您的问题没有在这里找到答案，请联系我们的支持团队</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/feedback"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              提交反馈
            </a>
            <a
              href="mailto:support@example.com"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              邮件联系
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}