'use client'

import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import { User, Mail, Calendar, BookOpen } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.name || '未设置姓名'}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">邮箱地址</p>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">姓名</p>
                  <p className="text-gray-900">{user?.name || '未设置'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">注册时间</p>
                  <p className="text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '未知'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">账户状态</p>
                  <p className="text-green-600 font-medium">正常</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">账户设置</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">通知设置</h4>
                <p className="text-sm text-gray-600">管理您的通知偏好</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                编辑
              </button>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">隐私设置</h4>
                <p className="text-sm text-gray-600">控制您的数据隐私</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                编辑
              </button>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <div>
                <h4 className="font-medium text-gray-900">修改密码</h4>
                <p className="text-sm text-gray-600">更新您的登录密码</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                修改
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}