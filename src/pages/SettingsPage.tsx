import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [pieceAnimation, setPieceAnimation] = useState<boolean>(true)
  const [boardTheme, setBoardTheme] = useState<string>('classic')

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled)
  }

  const handleAnimationToggle = () => {
    setPieceAnimation(!pieceAnimation)
  }

  const handleBoardThemeChange = (theme: string) => {
    setBoardTheme(theme)
  }

  return (
    <div id="settings-page" className="page">
      {/* 导航栏 */}
      <nav>
        <div>
          <button onClick={() => navigate('/')} className="bg-transparent border-none text-white cursor-pointer text-lg">
            ← 返回首页
          </button>
          <h1 className="text-2xl font-serif font-bold inline-block ml-4">AI 象棋</h1>
        </div>
        <div>
          <button onClick={() => navigate('/game')} className="bg-transparent border-none text-white cursor-pointer text-lg">
            开始游戏
          </button>
        </div>
      </nav>

      <div className="container">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">游戏设置</h2>
        
        <div className="card mb-6">
          <h3 className="text-xl mb-4">游戏设置</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>音效</span>
              <label className="relative inline-block w-11 h-6">
                <input 
                  type="checkbox" 
                  checked={soundEnabled}
                  onChange={handleSoundToggle}
                  className="opacity-0 w-0 h-0"
                />
                <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 transition-all duration-300 rounded-full ${soundEnabled ? 'bg-primary' : ''}`}></span>
                <span className={`absolute cursor-pointer top-1 left-1 w-4 h-4 bg-white transition-all duration-300 rounded-full ${soundEnabled ? 'transform translate-x-5' : ''}`}></span>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <span>棋子动画</span>
              <label className="relative inline-block w-11 h-6">
                <input 
                  type="checkbox" 
                  checked={pieceAnimation}
                  onChange={handleAnimationToggle}
                  className="opacity-0 w-0 h-0"
                />
                <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 transition-all duration-300 rounded-full ${pieceAnimation ? 'bg-primary' : ''}`}></span>
                <span className={`absolute cursor-pointer top-1 left-1 w-4 h-4 bg-white transition-all duration-300 rounded-full ${pieceAnimation ? 'transform translate-x-5' : ''}`}></span>
              </label>
            </div>
            <div className="form-group">
              <label className="block mb-2 font-medium">棋盘风格</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                value={boardTheme}
                onChange={(e) => handleBoardThemeChange(e.target.value)}
              >
                <option value="classic">经典风格</option>
                <option value="modern">现代风格</option>
                <option value="wooden">木质风格</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl mb-4">关于游戏</h3>
          <div className="space-y-4">
            <p>AI 象棋是一款基于网页的象棋游戏，支持玩家与AI对战，提供不同难度级别。</p>
            <p>版本：1.0.0</p>
            <p>© 2026 AI 象棋. 保留所有权利.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage