import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, UserPlus, LogIn } from 'lucide-react'

const Register: React.FC = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // 这里可以添加注册逻辑
    if (username && email && password && confirmPassword) {
      if (password === confirmPassword) {
        // 模拟注册成功
        navigate('/login')
      } else {
        setError('两次输入的密码不一致')
      }
    } else {
      setError('请填写所有必填字段')
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
              <h1 className="text-2xl font-serif font-bold">用户注册</h1>
            </div>
            <p className="text-white/80">注册新账号，开始你的象棋之旅</p>
          </div>

          {/* 注册表单 */}
          <div className="p-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">用户名</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                  placeholder="请输入用户名"
                />
              </div>
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
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">确认密码</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                  placeholder="请再次输入密码"
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary w-full"
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  <span>注册</span>
                </div>
              </button>
              <div className="text-center">
                <p className="text-gray-600">
                  已有账号？ 
                  <Link to="/login" className="text-[var(--primary-color)] font-bold hover:underline">
                    立即登录
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

export default Register