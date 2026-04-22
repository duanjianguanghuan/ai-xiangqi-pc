import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, User, Settings, History, LogOut } from 'lucide-react'

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'history' | 'info' | 'settings'>('history')

  // 模拟历史对局数据
  const gameHistory = [
    {
      id: 1,
      date: '2026-04-22',
      mode: '人机对弈',
      difficulty: '中等',
      result: '胜利',
      opponent: 'AI',
      moves: 45
    },
    {
      id: 2,
      date: '2026-04-21',
      mode: '在线对战',
      difficulty: '-',
      result: '失败',
      opponent: 'ChessMaster',
      moves: 38
    },
    {
      id: 3,
      date: '2026-04-20',
      mode: '人机对弈',
      difficulty: '困难',
      result: '胜利',
      opponent: 'AI',
      moves: 52
    }
  ]

  // 模拟用户信息
  const userInfo = {
    username: '象棋爱好者',
    email: 'user@example.com',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chess%20player%20avatar%20profile%20picture&image_size=square',
    joinDate: '2026-04-01',
    totalGames: 25,
    wins: 15,
    losses: 8,
    draws: 2
  }

  // 处理退出登录
  const handleLogout = () => {
    // 这里可以添加退出登录的逻辑
    navigate('/login')
  }

  // 返回首页
  const handleBackHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 导航栏 */}
      <nav className="bg-[var(--primary-color)] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBackHome}
              className="hover:text-[var(--secondary-color)] transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-serif font-bold">个人中心</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 hover:text-[var(--secondary-color)] transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>退出登录</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        {/* 个人信息卡片 */}
        <div className="card mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={userInfo.avatar} 
              alt="用户头像" 
              className="w-20 h-20 rounded-full object-cover border-4 border-[var(--secondary-color)]"
            />
            <div>
              <h2 className="text-2xl font-bold">{userInfo.username}</h2>
              <p className="text-gray-600">{userInfo.email}</p>
              <p className="text-gray-500 text-sm">加入时间: {userInfo.joinDate}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6 text-center">
            <div>
              <p className="text-2xl font-bold text-[var(--primary-color)]">{userInfo.totalGames}</p>
              <p className="text-gray-600">总对局</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{userInfo.wins}</p>
              <p className="text-gray-600">胜利</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{userInfo.losses}</p>
              <p className="text-gray-600">失败</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{userInfo.draws}</p>
              <p className="text-gray-600">平局</p>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex gap-2 mb-6">
          <button
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${activeTab === 'history' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('history')}
          >
            <div className="flex items-center justify-center gap-2">
              <History className="h-5 w-5" />
              <span>历史对局</span>
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${activeTab === 'info' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('info')}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="h-5 w-5" />
              <span>个人信息</span>
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${activeTab === 'settings' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('settings')}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings className="h-5 w-5" />
              <span>设置</span>
            </div>
          </button>
        </div>

        {/* 标签页内容 */}
        <div className="card">
          {/* 历史对局 */}
          {activeTab === 'history' && (
            <div>
              <h3 className="text-xl font-bold mb-4">历史对局记录</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">日期</th>
                      <th className="py-2 px-4 text-left">模式</th>
                      <th className="py-2 px-4 text-left">难度</th>
                      <th className="py-2 px-4 text-left">对手</th>
                      <th className="py-2 px-4 text-left">结果</th>
                      <th className="py-2 px-4 text-left">步数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameHistory.map((game) => (
                      <tr key={game.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{game.date}</td>
                        <td className="py-3 px-4">{game.mode}</td>
                        <td className="py-3 px-4">{game.difficulty}</td>
                        <td className="py-3 px-4">{game.opponent}</td>
                        <td className={`py-3 px-4 ${game.result === '胜利' ? 'text-green-600 font-bold' : game.result === '失败' ? 'text-red-600 font-bold' : 'text-blue-600 font-bold'}`}>
                          {game.result}
                        </td>
                        <td className="py-3 px-4">{game.moves}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {gameHistory.length === 0 && (
                <p className="text-center py-8 text-gray-500">暂无历史对局记录</p>
              )}
            </div>
          )}

          {/* 个人信息 */}
          {activeTab === 'info' && (
            <div>
              <h3 className="text-xl font-bold mb-4">个人信息</h3>
              <form className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">用户名</label>
                  <input 
                    type="text" 
                    value={userInfo.username} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">邮箱</label>
                  <input 
                    type="email" 
                    value={userInfo.email} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">头像</label>
                  <input 
                    type="file" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button 
                  type="button" 
                  className="btn-primary"
                >
                  更新个人信息
                </button>
              </form>
            </div>
          )}

          {/* 设置 */}
          {activeTab === 'settings' && (
            <div>
              <h3 className="text-xl font-bold mb-4">设置</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-3">游戏设置</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>音效</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>棋子动画</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">棋盘风格</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]">
                        <option>经典风格</option>
                        <option>现代风格</option>
                        <option>木质风格</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-3">账号设置</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">修改密码</label>
                      <button className="btn-secondary w-full">修改密码</button>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">隐私设置</label>
                      <button className="btn-secondary w-full">隐私设置</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile