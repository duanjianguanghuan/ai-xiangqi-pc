import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [gameMode, setGameMode] = useState<'ai' | 'online'>('ai')
  const [difficulty, setDifficulty] = useState<number>(2)

  const selectGameMode = (mode: 'ai' | 'online') => {
    setGameMode(mode)
  }

  const selectDifficulty = (level: number) => {
    setDifficulty(level)
  }

  const startGame = () => {
    navigate('/game', { state: { gameMode, difficulty } })
  }

  return (
    <div id="home-page" className="page">
      {/* 导航栏 */}
      <nav>
        <div>
          <h1 className="text-2xl font-serif font-bold">AI 象棋</h1>
        </div>
        <div>
          <a href="#" onClick={() => navigate('/settings')}>设置</a>
        </div>
      </nav>

      {/* 英雄区域 */}
      <div className="hero">
        <div className="container">
          <h1>智能象棋对战平台</h1>
          <p>挑战强大的AI对手，提升你的象棋水平</p>
          <div className="game-mode-selector">
            <h2 className="mb-6">开始游戏</h2>
            <div className="mb-6">
              <label className="block mb-2 text-lg">游戏模式</label>
              <div className="flex gap-4">
                <button 
                  id="ai-mode" 
                  className={gameMode === 'ai' ? 'btn-primary flex-1' : 'btn-secondary flex-1'}
                  onClick={() => selectGameMode('ai')}
                >
                  人机对弈
                </button>
                <button 
                  id="online-mode" 
                  className={gameMode === 'online' ? 'btn-primary flex-1' : 'btn-secondary flex-1'}
                  onClick={() => selectGameMode('online')}
                >
                  在线对战
                </button>
              </div>
            </div>
            <div id="difficulty-selector" className="mb-6">
              <label className="block mb-2 text-lg">难度级别</label>
              <div className="flex gap-2 flex-wrap">
                <button 
                  className={`btn-secondary ${difficulty === 1 ? 'bg-secondary text-primary' : ''}`}
                  onClick={() => selectDifficulty(1)}
                >
                  简单
                </button>
                <button 
                  className={`btn-secondary ${difficulty === 2 ? 'bg-secondary text-primary' : ''}`}
                  onClick={() => selectDifficulty(2)}
                >
                  中等
                </button>
                <button 
                  className={`btn-secondary ${difficulty === 3 ? 'bg-secondary text-primary' : ''}`}
                  onClick={() => selectDifficulty(3)}
                >
                  困难
                </button>
                <button 
                  className={`btn-secondary ${difficulty === 4 ? 'bg-secondary text-primary' : ''}`}
                  onClick={() => selectDifficulty(4)}
                >
                  专家
                </button>
                <button 
                  className={`btn-secondary ${difficulty === 5 ? 'bg-secondary text-primary' : ''}`}
                  onClick={() => selectDifficulty(5)}
                >
                  大师
                </button>
              </div>
            </div>
            <button className="btn-primary w-full" onClick={startGame}>
              开始游戏
            </button>
          </div>
        </div>

        {/* 特色介绍 */}
        <div className="container mt-16">
          <h2 className="text-center text-3xl mb-8">游戏特色</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="text-2xl mb-3">强大的AI对手</h3>
              <p className="text-gray-600">基于Minimax算法，提供从简单到大师级别的AI对手，适合不同水平的玩家</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="text-2xl mb-3">精美界面</h3>
              <p className="text-gray-600">传统象棋棋盘设计，流畅的棋子动画，提供沉浸式的游戏体验</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="text-2xl mb-3">跨平台支持</h3>
              <p className="text-gray-600">支持Web和桌面端，随时随地享受象棋对战的乐趣</p>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-primary text-white py-6 text-center">
        <p>© 2026 AI 象棋. 保留所有权利.</p>
      </footer>
    </div>
  )
}

export default HomePage