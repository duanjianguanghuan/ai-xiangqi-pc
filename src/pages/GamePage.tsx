import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface Piece {
  type: string
  color: 'red' | 'black'
}

interface Move {
  x: number
  y: number
}

interface GameState {
  board: (Piece | null)[][]
  selectedPiece: { x: number; y: number } | null
  validMoves: Move[]
  currentPlayer: 'red' | 'black'
  gameStatus: 'playing' | 'red_wins' | 'black_wins'
  aiThinking: boolean
  gameMode: 'ai' | 'online'
  difficulty: number
}

const GamePage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { gameMode = 'ai', difficulty = 2 } = location.state || {}

  const [gameState, setGameState] = useState<GameState>({
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
    selectedPiece: null,
    validMoves: [],
    currentPlayer: 'red',
    gameStatus: 'playing',
    aiThinking: false,
    gameMode,
    difficulty
  })

  // 初始化游戏
  useEffect(() => {
    initGame()
  }, [])

  // 初始化棋盘
  const initGame = () => {
    const board = Array(8).fill(null).map(() => Array(8).fill(null))
    initPieces(board)
    setGameState(prev => ({
      ...prev,
      board,
      selectedPiece: null,
      validMoves: [],
      currentPlayer: 'red',
      gameStatus: 'playing',
      aiThinking: false
    }))
  }

  // 初始化棋子
  const initPieces = (board: (Piece | null)[][]) => {
    // 红方
    board[0][0] = { type: '车', color: 'red' }
    board[0][1] = { type: '马', color: 'red' }
    board[0][2] = { type: '相', color: 'red' }
    board[0][3] = { type: '仕', color: 'red' }
    board[0][4] = { type: '帅', color: 'red' }
    board[0][5] = { type: '仕', color: 'red' }
    board[0][6] = { type: '相', color: 'red' }
    board[0][7] = { type: '马', color: 'red' }
    board[0][8] = { type: '车', color: 'red' }
    board[2][1] = { type: '炮', color: 'red' }
    board[2][7] = { type: '炮', color: 'red' }
    board[3][0] = { type: '兵', color: 'red' }
    board[3][2] = { type: '兵', color: 'red' }
    board[3][4] = { type: '兵', color: 'red' }
    board[3][6] = { type: '兵', color: 'red' }
    board[3][8] = { type: '兵', color: 'red' }
    
    // 黑方
    board[7][0] = { type: '车', color: 'black' }
    board[7][1] = { type: '马', color: 'black' }
    board[7][2] = { type: '相', color: 'black' }
    board[7][3] = { type: '仕', color: 'black' }
    board[7][4] = { type: '帅', color: 'black' }
    board[7][5] = { type: '仕', color: 'black' }
    board[7][6] = { type: '相', color: 'black' }
    board[7][7] = { type: '马', color: 'black' }
    board[7][8] = { type: '车', color: 'black' }
    board[5][1] = { type: '炮', color: 'black' }
    board[5][7] = { type: '炮', color: 'black' }
    board[4][0] = { type: '兵', color: 'black' }
    board[4][2] = { type: '兵', color: 'black' }
    board[4][4] = { type: '兵', color: 'black' }
    board[4][6] = { type: '兵', color: 'black' }
    board[4][8] = { type: '兵', color: 'black' }
  }

  // 处理棋盘点击
  const handleSquareClick = (x: number, y: number) => {
    if (gameState.gameStatus !== 'playing') return
    if (gameState.aiThinking) return

    const piece = gameState.board[x][y]

    // 如果已经选择了棋子，尝试移动
    if (gameState.selectedPiece) {
      const selectedX = gameState.selectedPiece.x
      const selectedY = gameState.selectedPiece.y
      const selectedPieceData = gameState.board[selectedX][selectedY]

      if (selectedPieceData && selectedPieceData.color === gameState.currentPlayer) {
        // 检查是否是有效移动
        const isValidMove = gameState.validMoves.some(move => move.x === x && move.y === y)
        if (isValidMove) {
          // 执行移动
          const newBoard = [...gameState.board.map(row => [...row])]
          newBoard[x][y] = selectedPieceData
          newBoard[selectedX][selectedY] = null

          // 检查游戏是否结束
          const newGameStatus = checkGameStatus(newBoard)

          // 重新渲染棋盘
          setGameState(prev => ({
            ...prev,
            board: newBoard,
            selectedPiece: null,
            validMoves: [],
            gameStatus: newGameStatus
          }))

          // 切换玩家
          const newPlayer = gameState.currentPlayer === 'red' ? 'black' : 'red'
          setGameState(prev => ({
            ...prev,
            currentPlayer: newPlayer
          }))

          // 如果是人机对弈且轮到AI
          if (gameState.gameMode === 'ai' && newPlayer === 'black' && newGameStatus === 'playing') {
            setTimeout(aiMove, 1000)
          }
        } else {
          // 取消选择
          setGameState(prev => ({
            ...prev,
            selectedPiece: null,
            validMoves: []
          }))
        }
      }
    } else if (piece && piece.color === gameState.currentPlayer) {
      // 选择棋子
      const validMoves = getValidMoves(piece, x, y, gameState.board)
      setGameState(prev => ({
        ...prev,
        selectedPiece: { x, y },
        validMoves
      }))
    }
  }

  // 获取有效移动位置
  const getValidMoves = (piece: Piece, x: number, y: number, board: (Piece | null)[][]): Move[] => {
    const moves: Move[] = []
    const { type, color } = piece

    switch (type) {
      case '帅':
        // 帅只能在九宫格内移动，每次走一步
        const palaceXRange = color === 'red' ? [0, 1, 2] : [5, 6, 7]
        const palaceYRange = [3, 4, 5]
        
        // 上下左右移动
        const directions = [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
        for (const { dx, dy } of directions) {
          const newX = x + dx
          const newY = y + dy
          if (palaceXRange.includes(newX) && palaceYRange.includes(newY)) {
            const targetPiece = board[newX][newY]
            if (!targetPiece || targetPiece.color !== color) {
              moves.push({ x: newX, y: newY })
            }
          }
        }
        break

      case '仕':
        // 仕只能在九宫格内斜着走，每次走一步
        const palaceXRangeShi = color === 'red' ? [0, 1, 2] : [5, 6, 7]
        const palaceYRangeShi = [3, 4, 5]
        
        // 斜着移动
        const diagonalDirections = [{ dx: -1, dy: -1 }, { dx: -1, dy: 1 }, { dx: 1, dy: -1 }, { dx: 1, dy: 1 }]
        for (const { dx, dy } of diagonalDirections) {
          const newX = x + dx
          const newY = y + dy
          if (palaceXRangeShi.includes(newX) && palaceYRangeShi.includes(newY)) {
            const targetPiece = board[newX][newY]
            if (!targetPiece || targetPiece.color !== color) {
              moves.push({ x: newX, y: newY })
            }
          }
        }
        break

      case '相':
        // 相只能斜着走，每次走两步，不能过河，不能塞象眼
        const xRangeXiang = color === 'red' ? [0, 1, 2, 3] : [4, 5, 6, 7]
        
        // 斜着移动两步
        const diagonalDirectionsXiang = [{ dx: -2, dy: -2 }, { dx: -2, dy: 2 }, { dx: 2, dy: -2 }, { dx: 2, dy: 2 }]
        for (const { dx, dy } of diagonalDirectionsXiang) {
          const newX = x + dx
          const newY = y + dy
          if (xRangeXiang.includes(newX) && newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            // 检查象眼是否被塞
            const eyeX = x + dx / 2
            const eyeY = y + dy / 2
            if (!board[eyeX][eyeY]) {
              const targetPiece = board[newX][newY]
              if (!targetPiece || targetPiece.color !== color) {
                moves.push({ x: newX, y: newY })
              }
            }
          }
        }
        break

      case '马':
        // 马走日，不能蹩马腿
        const horseDirections = [
          { dx: -2, dy: -1 }, { dx: -2, dy: 1 },
          { dx: -1, dy: -2 }, { dx: -1, dy: 2 },
          { dx: 1, dy: -2 }, { dx: 1, dy: 2 },
          { dx: 2, dy: -1 }, { dx: 2, dy: 1 }
        ]
        
        for (const { dx, dy } of horseDirections) {
          const newX = x + dx
          const newY = y + dy
          if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            // 检查马腿是否被蹩
            const legX = x + (dx > 0 ? 1 : dx < 0 ? -1 : 0)
            const legY = y + (dy > 0 ? 1 : dy < 0 ? -1 : 0)
            if (!board[legX][legY]) {
              const targetPiece = board[newX][newY]
              if (!targetPiece || targetPiece.color !== color) {
                moves.push({ x: newX, y: newY })
              }
            }
          }
        }
        break

      case '车':
        // 车可以直走，不限步数，不能越过其他棋子
        const rookDirections = [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
        
        for (const { dx, dy } of rookDirections) {
          let newX = x + dx
          let newY = y + dy
          while (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            const targetPiece = board[newX][newY]
            if (!targetPiece) {
              moves.push({ x: newX, y: newY })
            } else if (targetPiece.color !== color) {
              moves.push({ x: newX, y: newY })
              break
            } else {
              break
            }
            newX += dx
            newY += dy
          }
        }
        break

      case '炮':
        // 炮可以直走，不限步数，吃子需要隔一个棋子
        const cannonDirections = [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
        
        for (const { dx, dy } of cannonDirections) {
          let newX = x + dx
          let newY = y + dy
          let hasPiece = false
          while (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            const targetPiece = board[newX][newY]
            if (!targetPiece) {
              if (!hasPiece) {
                moves.push({ x: newX, y: newY })
              }
            } else if (targetPiece.color !== color) {
              if (hasPiece) {
                moves.push({ x: newX, y: newY })
              }
              break
            } else {
              if (!hasPiece) {
                hasPiece = true
              } else {
                break
              }
            }
            newX += dx
            newY += dy
          }
        }
        break

      case '兵':
        // 兵未过河只能向前走，过河后可以左右走，每次走一步
        if (color === 'red') {
          // 红兵
          if (x < 4) {
            // 未过河，只能向前
            if (x + 1 < 8) {
              const targetPiece = board[x + 1][y]
              if (!targetPiece || targetPiece.color !== color) {
                moves.push({ x: x + 1, y })
              }
            }
          } else {
            // 已过河，可以左右和向前
            const soldierDirections = [{ dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
            for (const { dx, dy } of soldierDirections) {
              const newX = x + dx
              const newY = y + dy
              if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                const targetPiece = board[newX][newY]
                if (!targetPiece || targetPiece.color !== color) {
                  moves.push({ x: newX, y: newY })
                }
              }
            }
          }
        } else {
          // 黑兵
          if (x > 3) {
            // 未过河，只能向前
            if (x - 1 >= 0) {
              const targetPiece = board[x - 1][y]
              if (!targetPiece || targetPiece.color !== color) {
                moves.push({ x: x - 1, y })
              }
            }
          } else {
            // 已过河，可以左右和向前
            const soldierDirections = [{ dx: -1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
            for (const { dx, dy } of soldierDirections) {
              const newX = x + dx
              const newY = y + dy
              if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                const targetPiece = board[newX][newY]
                if (!targetPiece || targetPiece.color !== color) {
                  moves.push({ x: newX, y: newY })
                }
              }
            }
          }
        }
        break
    }

    return moves
  }

  // 检查游戏状态
  const checkGameStatus = (board: (Piece | null)[][]): 'playing' | 'red_wins' | 'black_wins' => {
    let redKingExists = false
    let blackKingExists = false

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const piece = board[x][y]
        if (piece && piece.type === '帅') {
          if (piece.color === 'red') {
            redKingExists = true
          } else {
            blackKingExists = true
          }
        }
      }
    }

    if (!redKingExists) {
      return 'black_wins'
    } else if (!blackKingExists) {
      return 'red_wins'
    }

    return 'playing'
  }

  // AI 移动
  const aiMove = () => {
    setGameState(prev => ({
      ...prev,
      aiThinking: true
    }))

    // 简单的AI逻辑：随机选择一个可移动的棋子并移动
    setTimeout(() => {
      const blackPieces: { x: number; y: number }[] = []
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const piece = gameState.board[x][y]
          if (piece && piece.color === 'black') {
            blackPieces.push({ x, y })
          }
        }
      }

      // 随机选择一个棋子
      const randomPieceIndex = Math.floor(Math.random() * blackPieces.length)
      const selectedPiecePos = blackPieces[randomPieceIndex]
      const selectedPiece = gameState.board[selectedPiecePos.x][selectedPiecePos.y]

      if (selectedPiece) {
        const moves = getValidMoves(selectedPiece, selectedPiecePos.x, selectedPiecePos.y, gameState.board)
        if (moves.length > 0) {
          // 随机选择一个移动位置
          const randomMoveIndex = Math.floor(Math.random() * moves.length)
          const move = moves[randomMoveIndex]

          // 执行移动
          const newBoard = [...gameState.board.map(row => [...row])]
          newBoard[move.x][move.y] = selectedPiece
          newBoard[selectedPiecePos.x][selectedPiecePos.y] = null

          // 检查游戏是否结束
          const newGameStatus = checkGameStatus(newBoard)

          // 重新渲染棋盘
          setGameState(prev => ({
            ...prev,
            board: newBoard,
            gameStatus: newGameStatus
          }))
        }
      }

      setGameState(prev => ({
        ...prev,
        aiThinking: false,
        currentPlayer: 'red'
      }))
    }, 1000)
  }

  // 重新开始游戏
  const restartGame = () => {
    initGame()
  }

  return (
    <div id="game-page" className="page">
      {/* 导航栏 */}
      <nav>
        <div>
          <button onClick={() => navigate('/')} className="bg-transparent border-none text-white cursor-pointer text-lg">
            ← 返回首页
          </button>
          <h1 className="text-2xl font-serif font-bold inline-block ml-4">AI 象棋</h1>
        </div>
        <div>
          <button onClick={restartGame} className="bg-transparent border-none text-white cursor-pointer text-lg mr-4">
            重新开始
          </button>
          <button onClick={() => navigate('/settings')} className="bg-transparent border-none text-white cursor-pointer text-lg">
            设置
          </button>
        </div>
      </nav>

      <div className="container">
        {/* 游戏状态 */}
        <div className="game-status">
          <div>
            <span id="red-player" className="text-2xl font-bold text-red-piece">红方</span>
            <span className="text-2xl font-bold mx-3">vs</span>
            <span id="black-player" className="text-2xl font-bold text-black-piece">黑方</span>
          </div>
          <div id="ai-thinking" className={gameState.aiThinking ? 'block' : 'hidden'}>
            <span className="text-gray-600">AI 思考中...</span>
          </div>
        </div>

        {/* 游戏结果 */}
        <div 
          id="game-result" 
          className="game-result" 
          style={{ display: gameState.gameStatus !== 'playing' ? 'flex' : 'none' }}
        >
          <div className="game-result-content">
            <h2 id="result-message" className="text-2xl mb-6">
              {gameState.gameStatus === 'red_wins' ? '红方胜利！' : '黑方胜利！'}
            </h2>
            <div className="flex gap-4 justify-center">
              <button className="btn-primary" onClick={restartGame}>
                再玩一局
              </button>
              <button className="btn-secondary" onClick={() => navigate('/')}>
                返回首页
              </button>
            </div>
          </div>
        </div>

        {/* 棋盘 */}
        <div className="chessboard" id="chessboard">
          {gameState.board.map((row, x) => 
            row.map((piece, y) => {
              const isLight = (x + y) % 2 === 0
              const isSelected = gameState.selectedPiece?.x === x && gameState.selectedPiece?.y === y
              const isValidMove = gameState.validMoves.some(move => move.x === x && move.y === y)
              const isCapture = isValidMove && piece !== null

              return (
                <div
                  key={`${x}-${y}`}
                  className={`chess-square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isValidMove ? (isCapture ? 'valid-capture' : 'valid-move') : ''}`}
                  onClick={() => handleSquareClick(x, y)}
                >
                  {piece && (
                    <div className={`chess-piece ${piece.color === 'red' ? 'text-red-piece' : 'text-black-piece'}`}>
                      {piece.type}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* 游戏信息 */}
        <div className="card mt-6">
          <h3 className="text-xl mb-4">游戏信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>游戏模式：</strong><span id="game-mode">{gameState.gameMode === 'ai' ? '人机对弈' : '在线对战'}</span></p>
              <p><strong>难度级别：</strong><span id="game-difficulty">{gameState.difficulty === 1 ? '简单' : gameState.difficulty === 2 ? '中等' : gameState.difficulty === 3 ? '困难' : gameState.difficulty === 4 ? '专家' : '大师'}</span></p>
            </div>
            <div>
              <p><strong>当前回合：</strong><span id="current-turn">{gameState.currentPlayer === 'red' ? '红方' : '黑方'}</span></p>
              <p><strong>游戏状态：</strong><span id="game-status">{gameState.gameStatus === 'playing' ? '进行中' : gameState.gameStatus === 'red_wins' ? '红方胜利' : '黑方胜利'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GamePage