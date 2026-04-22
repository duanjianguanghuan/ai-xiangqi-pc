import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, LogIn, UserPlus } from 'lucide-react'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // 这里可以添加登录逻辑
    if (email && password) {
      // 模拟登录成功
      navigate('/profile')
    } else {
      setError('请输入邮箱和密码')
    }
  }

  const handleBackHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--primary-color)] to-blue-900 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* 头部 */}
          <div className="bg-[var(--primary-color)] text-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={handleBackHome}
                className="hover:text-[var(--secondary-color)] transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-serif font-bold">用户登录</h1>
            </div>
            <p className="text-white/80">登录后可享受完整的游戏功能</p>
          </div>

          {/* 登录表单 */}
          <div className="p-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">邮箱</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                  placeholder="请输入邮箱"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">密码</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                  placeholder="请输入密码"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    记住我
                  </label>
                </div>
                <a href="#" className="text-sm text-[var(--primary-color)] hover:underline">
                  忘记密码？
                </a>
              </div>
              <button 
                type="submit" 
                className="btn-primary w-full"
              >
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5" />
                  <span>登录</span>
                </div>
              </button>
              <div className="text-center">
                <p className="text-gray-600">
                  还没有账号？ 
                  <Link to="/register" className="text-[var(--primary-color)] font-bold hover:underline">
                    立即注册
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login