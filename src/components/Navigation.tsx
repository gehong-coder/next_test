'use client'

import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BookOpen, 
  Home, 
  MessageCircle, 
  User, 
  HelpCircle, 
  MessageSquare,
  LogOut
} from 'lucide-react'

export default function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navigationItems = [
    { href: '/dashboard', label: '首页', icon: Home },
    { href: '/books', label: '我的图书', icon: BookOpen },
    { href: '/ai-assistant', label: 'AI助手', icon: MessageCircle },
    { href: '/profile', label: '个人中心', icon: User },
    { href: '/help', label: '帮助中心', icon: HelpCircle },
    { href: '/feedback', label: '意见反馈', icon: MessageSquare },
  ]

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">智能图书管理</h1>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-50 ${
                isActive
                  ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* User Info & Logout */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user.name || user.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="退出登录"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}