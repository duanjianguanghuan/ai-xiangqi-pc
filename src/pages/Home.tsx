import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, User, LogIn, UserPlus, Crown } from 'lucide-react'

const Home: React.FC = () => {
  const [gameMode, setGameMode] = useState<'ai' | 'online'>('ai')
  const [difficulty, setDifficulty] = useState<number>(2)
  const navigate = useNavigate()

  const handleStartGame = () => {
    navigate('/game', {
      state: { gameMode, difficulty }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--primary-color)] to-blue-900 text-white">
      {/* 导航栏 */}
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Crown className="h-8 w-8 text-[var(--secondary-color)]" />
          <h1 className="text-2xl font-serif font-bold">AI 象棋</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="flex items-center gap-1 hover:text-[var(--secondary-color)] transition-colors">
            <LogIn className="h-5 w-5" />
            <span>登录</span>
          </Link>
          <Link to="/register" className="flex items-center gap-1 hover:text-[var(--secondary-color)] transition-colors">
            <UserPlus className="h-5 w-5" />
            <span>注册</span>
          </Link>
          <Link to="/profile" className="flex items-center gap-1 hover:text-[var(--secondary-color)] transition-colors">
            <User className="h-5 w-5" />
            <span>个人中心</span>
          </Link>
        </div>
      </nav>

      {/* 英雄区域 */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="title text-4xl md:text-6xl mb-4">智能象棋对战平台</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          挑战强大的AI对手，或与全球玩家在线对战，提升你的象棋水平
        </p>
        <div className="flex justify-center mb-12">
          <img 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20chess%20board%20with%20pieces%20on%20dark%20blue%20background%20with%20gold%20accents&image_size=landscape_16_9" 
            alt="象棋棋盘" 
            className="rounded-xl shadow-2xl max-w-full md:max-w-2xl"
          />
        </div>

        {/* 游戏模式选择 */}
        <div className="card bg-white/10 backdrop-blur-md max-w-2xl mx-auto p-8 rounded-2xl">
          <h2 className="title text-2xl md:text-3xl mb-6 text-center">开始游戏</h2>
          
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium">游戏模式</label>
            <div className="flex gap-4 justify-center">
              <button
                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${gameMode === 'ai' ? 'bg-[var(--secondary-color)] text-[var(--primary-color)] font-bold' : 'bg-white/20 hover:bg-white/30'}`}
                onClick={() => setGameMode('ai')}
              >
                人机对弈
              </button>
              <button
                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${gameMode === 'online' ? 'bg-[var(--secondary-color)] text-[var(--primary-color)] font-bold' : 'bg-white/20 hover:bg-white/30'}`}
                onClick={() => setGameMode('online')}
              >
                在线对战
              </button>
            </div>
          </div>

          {/* 难度选择 */}
          {gameMode === 'ai' && (
            <div className="mb-8">
              <label className="block mb-2 text-lg font-medium">难度级别</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${difficulty === level ? 'bg-[var(--secondary-color)] text-[var(--primary-color)] font-bold' : 'bg-white/20 hover:bg-white/30'}`}
                    onClick={() => setDifficulty(level)}
                  >
                    {level === 1 && '简单'}
                    {level === 2 && '中等'}
                    {level === 3 && '困难'}
                    {level === 4 && '专家'}
                    {level === 5 && '大师'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className="btn-primary w-full"
            onClick={handleStartGame}
          >
            开始游戏
          </button>
        </div>
      </div>

      {/* 特色介绍 */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="title text-3xl md:text-4xl mb-12 text-center">游戏特色</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <div className="bg-[var(--secondary-color)] text-[var(--primary-color)] p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">强大的AI对手</h3>
            <p className="text-white/80">
              基于Stockfish引擎，提供从简单到大师级别的AI对手，适合不同水平的玩家
            </p>
          </div>
          <div className="card bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <div className="bg-[var(--secondary-color)] text-[var(--primary-color)] p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <User className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">在线对战</h3>
            <p className="text-white/80">
              与全球玩家实时对战，挑战不同风格的对手，提升你的象棋技巧
            </p>
          </div>
          <div className="card bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <div className="bg-[var(--secondary-color)] text-[var(--primary-color)] p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Crown className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">精美界面</h3>
            <p className="text-white/80">
              传统象棋棋盘设计，流畅的棋子动画，提供沉浸式的游戏体验
            </p>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="container mx-auto px-4 py-8 text-center text-white/60">
        <p>© 2026 AI 象棋. 保留所有权利.</p>
      </footer>
    </div>
  )
}

export default Home