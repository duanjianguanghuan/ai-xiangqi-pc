import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, RotateCcw, Home, Clock } from 'lucide-react'

// 定义棋盘状态类型
interface Position {
  x: number
  y: number
}

interface ChessPiece {
  type: '帅' | '仕' | '相' | '马' | '车' | '炮' | '兵'
  color: 'red' | 'black'
  position: Position
}

const Game: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { gameMode, difficulty } = location.state as { gameMode: 'ai' | 'online', difficulty: number }

  // 初始化棋盘
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(() => {
    // 初始化红方棋子
    const initialBoard: (ChessPiece | null)[][] = Array(10).fill(null).map(() => Array(9).fill(null))
    
    // 红方
    initialBoard[0][0] = { type: '车', color: 'red', position: { x: 0, y: 0 } }
    initialBoard[0][1] = { type: '马', color: 'red', position: { x: 0, y: 1 } }
    initialBoard[0][2] = { type: '相', color: 'red', position: { x: 0, y: 2 } }
    initialBoard[0][3] = { type: '仕', color: 'red', position: { x: 0, y: 3 } }
    initialBoard[0][4] = { type: '帅', color: 'red', position: { x: 0, y: 4 } }
    initialBoard[0][5] = { type: '仕', color: 'red', position: { x: 0, y: 5 } }
    initialBoard[0][6] = { type: '相', color: 'red', position: { x: 0, y: 6 } }
    initialBoard[0][7] = { type: '马', color: 'red', position: { x: 0, y: 7 } }
    initialBoard[0][8] = { type: '车', color: 'red', position: { x: 0, y: 8 } }
    initialBoard[2][1] = { type: '炮', color: 'red', position: { x: 2, y: 1 } }
    initialBoard[2][7] = { type: '炮', color: 'red', position: { x: 2, y: 7 } }
    initialBoard[3][0] = { type: '兵', color: 'red', position: { x: 3, y: 0 } }
    initialBoard[3][2] = { type: '兵', color: 'red', position: { x: 3, y: 2 } }
    initialBoard[3][4] = { type: '兵', color: 'red', position: { x: 3, y: 4 } }
    initialBoard[3][6] = { type: '兵', color: 'red', position: { x: 3, y: 6 } }
    initialBoard[3][8] = { type: '兵', color: 'red', position: { x: 3, y: 8 } }
    
    // 黑方
    initialBoard[9][0] = { type: '车', color: 'black', position: { x: 9, y: 0 } }
    initialBoard[9][1] = { type: '马', color: 'black', position: { x: 9, y: 1 } }
    initialBoard[9][2] = { type: '相', color: 'black', position: { x: 9, y: 2 } }
    initialBoard[9][3] = { type: '仕', color: 'black', position: { x: 9, y: 3 } }
    initialBoard[9][4] = { type: '帅', color: 'black', position: { x: 9, y: 4 } }
    initialBoard[9][5] = { type: '仕', color: 'black', position: { x: 9, y: 5 } }
    initialBoard[9][6] = { type: '相', color: 'black', position: { x: 9, y: 6 } }
    initialBoard[9][7] = { type: '马', color: 'black', position: { x: 9, y: 7 } }
    initialBoard[9][8] = { type: '车', color: 'black', position: { x: 9, y: 8 } }
    initialBoard[7][1] = { type: '炮', color: 'black', position: { x: 7, y: 1 } }
    initialBoard[7][7] = { type: '炮', color: 'black', position: { x: 7, y: 7 } }
    initialBoard[6][0] = { type: '兵', color: 'black', position: { x: 6, y: 0 } }
    initialBoard[6][2] = { type: '兵', color: 'black', position: { x: 6, y: 2 } }
    initialBoard[6][4] = { type: '兵', color: 'black', position: { x: 6, y: 4 } }
    initialBoard[6][6] = { type: '兵', color: 'black', position: { x: 6, y: 6 } }
    initialBoard[6][8] = { type: '兵', color: 'black', position: { x: 6, y: 8 } }
    
    return initialBoard
  })

  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'black'>('red')
  const [gameStatus, setGameStatus] = useState<'playing' | 'red_wins' | 'black_wins'>('playing')
  const [aiThinking, setAiThinking] = useState(false)

  // 检查位置是否在棋盘范围内
  const isInBounds = (x: number, y: number): boolean => {
    return x >= 0 && x < 10 && y >= 0 && y < 9
  }

  // 检查位置是否有己方棋子
  const hasFriendlyPiece = (x: number, y: number, color: 'red' | 'black'): boolean => {
    if (!isInBounds(x, y)) return false
    const piece = board[x][y]
    return piece !== null && piece.color === color
  }

  // 检查位置是否有敌方棋子
  const hasEnemyPiece = (x: number, y: number, color: 'red' | 'black'): boolean => {
    if (!isInBounds(x, y)) return false
    const piece = board[x][y]
    return piece !== null && piece.color !== color
  }

  // 获取有效移动位置
  const getValidMoves = (piece: ChessPiece): Position[] => {
    const { type, color, position } = piece
    const { x, y } = position
    const moves: Position[] = []

    switch (type) {
      case '帅':
        // 帅只能在九宫格内移动，每次走一步
        const palaceXRange = color === 'red' ? [0, 1, 2] : [7, 8, 9]
        const palaceYRange = [3, 4, 5]
        
        // 上下左右移动
        const directions = [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
        for (const { dx, dy } of directions) {
          const newX = x + dx
          const newY = y + dy
          if (palaceXRange.includes(newX) && palaceYRange.includes(newY)) {
            if (!hasFriendlyPiece(newX, newY, color)) {
              moves.push({ x: newX, y: newY })
            }
          }
        }
        break

      case '仕':
        // 仕只能在九宫格内斜着走，每次走一步
        const palaceXRangeShi = color === 'red' ? [0, 1, 2] : [7, 8, 9]
        const palaceYRangeShi = [3, 4, 5]
        
        // 斜着移动
        const diagonalDirections = [{ dx: -1, dy: -1 }, { dx: -1, dy: 1 }, { dx: 1, dy: -1 }, { dx: 1, dy: 1 }]
        for (const { dx, dy } of diagonalDirections) {
          const newX = x + dx
          const newY = y + dy
          if (palaceXRangeShi.includes(newX) && palaceYRangeShi.includes(newY)) {
            if (!hasFriendlyPiece(newX, newY, color)) {
              moves.push({ x: newX, y: newY })
            }
          }
        }
        break

      case '相':
        // 相只能斜着走，每次走两步，不能过河，不能塞象眼
        const xRangeXiang = color === 'red' ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9]
        
        // 斜着移动两步
        const diagonalDirectionsXiang = [{ dx: -2, dy: -2 }, { dx: -2, dy: 2 }, { dx: 2, dy: -2 }, { dx: 2, dy: 2 }]
        for (const { dx, dy } of diagonalDirectionsXiang) {
          const newX = x + dx
          const newY = y + dy
          if (xRangeXiang.includes(newX) && isInBounds(newX, newY)) {
            // 检查象眼是否被塞
            const eyeX = x + dx / 2
            const eyeY = y + dy / 2
            if (board[eyeX][eyeY] === null && !hasFriendlyPiece(newX, newY, color)) {
              moves.push({ x: newX, y: newY })
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
          if (isInBounds(newX, newY)) {
            // 检查马腿是否被蹩
            const legX = x + (dx > 0 ? 1 : dx < 0 ? -1 : 0)
            const legY = y + (dy > 0 ? 1 : dy < 0 ? -1 : 0)
            if (board[legX][legY] === null && !hasFriendlyPiece(newX, newY, color)) {
              moves.push({ x: newX, y: newY })
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
          while (isInBounds(newX, newY)) {
            if (board[newX][newY] === null) {
              moves.push({ x: newX, y: newY })
            } else if (board[newX][newY]?.color !== color) {
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
          while (isInBounds(newX, newY)) {
            if (board[newX][newY] === null) {
              if (!hasPiece) {
                moves.push({ x: newX, y: newY })
              }
            } else if (board[newX][newY]?.color !== color) {
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
          if (x < 5) {
            // 未过河，只能向前
            if (x + 1 < 10 && !hasFriendlyPiece(x + 1, y, color)) {
              moves.push({ x: x + 1, y })
            }
          } else {
            // 已过河，可以左右和向前
            const soldierDirections = [{ dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
            for (const { dx, dy } of soldierDirections) {
              const newX = x + dx
              const newY = y + dy
              if (isInBounds(newX, newY) && !hasFriendlyPiece(newX, newY, color)) {
                moves.push({ x: newX, y: newY })
              }
            }
          }
        } else {
          // 黑兵
          if (x > 4) {
            // 未过河，只能向前
            if (x - 1 >= 0 && !hasFriendlyPiece(x - 1, y, color)) {
              moves.push({ x: x - 1, y })
            }
          } else {
            // 已过河，可以左右和向前
            const soldierDirections = [{ dx: -1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
            for (const { dx, dy } of soldierDirections) {
              const newX = x + dx
              const newY = y + dy
              if (isInBounds(newX, newY) && !hasFriendlyPiece(newX, newY, color)) {
                moves.push({ x: newX, y: newY })
              }
            }
          }
        }
        break
    }

    return moves
  }

  // 处理棋子选择
  const handleSquareClick = (x: number, y: number) => {
    if (gameStatus !== 'playing') return

    const piece = board[x][y]

    // 如果已经选择了棋子，尝试移动
    if (selectedPiece) {
      const selectedX = selectedPiece.x
      const selectedY = selectedPiece.y
      const selectedPieceData = board[selectedX][selectedY]

      if (selectedPieceData && selectedPieceData.color === currentPlayer) {
        // 检查是否是有效移动
        const isValidMove = validMoves.some(move => move.x === x && move.y === y)
        if (isValidMove) {
          // 执行移动
          const newBoard = [...board.map(row => [...row])]
          newBoard[x][y] = {
            ...selectedPieceData,
            position: { x, y }
          }
          newBoard[selectedX][selectedY] = null

          // 检查游戏是否结束
          const newGameStatus = checkGameStatus(newBoard)
          setGameStatus(newGameStatus)

          setBoard(newBoard)
          setSelectedPiece(null)
          setValidMoves([])

          // 切换玩家
          setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red')
        } else {
          // 取消选择
          setSelectedPiece(null)
          setValidMoves([])
        }
      }
    } else if (piece && piece.color === currentPlayer) {
      // 选择棋子
      setSelectedPiece({ x, y })
      setValidMoves(getValidMoves(piece))
    }
  }

  // 检查游戏状态
  const checkGameStatus = (board: (ChessPiece | null)[][]): 'playing' | 'red_wins' | 'black_wins' => {
    let redKingExists = false
    let blackKingExists = false

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 9; y++) {
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

    if (!redKingExists) return 'black_wins'
    if (!blackKingExists) return 'red_wins'
    return 'playing'
  }

  // AI 移动
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'black' && gameStatus === 'playing') {
      setAiThinking(true)
      
      // 简单的AI逻辑：随机选择一个可移动的棋子并移动
      setTimeout(() => {
        const blackPieces: Position[] = []
        for (let x = 0; x < 10; x++) {
          for (let y = 0; y < 9; y++) {
            const piece = board[x][y]
            if (piece && piece.color === 'black') {
              blackPieces.push({ x, y })
            }
          }
        }

        // 随机选择一个棋子
        const randomPieceIndex = Math.floor(Math.random() * blackPieces.length)
        const selectedPiecePos = blackPieces[randomPieceIndex]
        const selectedPiece = board[selectedPiecePos.x][selectedPiecePos.y]

        if (selectedPiece) {
          const moves = getValidMoves(selectedPiece)
          if (moves.length > 0) {
            // 随机选择一个移动位置
            const randomMoveIndex = Math.floor(Math.random() * moves.length)
            const move = moves[randomMoveIndex]

            // 执行移动
            const newBoard = [...board.map(row => [...row])]
            newBoard[move.x][move.y] = {
              ...selectedPiece,
              position: { x: move.x, y: move.y }
            }
            newBoard[selectedPiecePos.x][selectedPiecePos.y] = null

            // 检查游戏是否结束
            const newGameStatus = checkGameStatus(newBoard)
            setGameStatus(newGameStatus)

            setBoard(newBoard)
          }
        }

        setAiThinking(false)
        setCurrentPlayer('red')
      }, 1000)
    }
  }, [currentPlayer, gameMode, gameStatus, board])

  // 重新开始游戏
  const handleRestart = () => {
    // 重置棋盘
    const initialBoard: (ChessPiece | null)[][] = Array(10).fill(null).map(() => Array(9).fill(null))
    
    // 红方
    initialBoard[0][0] = { type: '车', color: 'red', position: { x: 0, y: 0 } }
    initialBoard[0][1] = { type: '马', color: 'red', position: { x: 0, y: 1 } }
    initialBoard[0][2] = { type: '相', color: 'red', position: { x: 0, y: 2 } }
    initialBoard[0][3] = { type: '仕', color: 'red', position: { x: 0, y: 3 } }
    initialBoard[0][4] = { type: '帅', color: 'red', position: { x: 0, y: 4 } }
    initialBoard[0][5] = { type: '仕', color: 'red', position: { x: 0, y: 5 } }
    initialBoard[0][6] = { type: '相', color: 'red', position: { x: 0, y: 6 } }
    initialBoard[0][7] = { type: '马', color: 'red', position: { x: 0, y: 7 } }
    initialBoard[0][8] = { type: '车', color: 'red', position: { x: 0, y: 8 } }
    initialBoard[2][1] = { type: '炮', color: 'red', position: { x: 2, y: 1 } }
    initialBoard[2][7] = { type: '炮', color: 'red', position: { x: 2, y: 7 } }
    initialBoard[3][0] = { type: '兵', color: 'red', position: { x: 3, y: 0 } }
    initialBoard[3][2] = { type: '兵', color: 'red', position: { x: 3, y: 2 } }
    initialBoard[3][4] = { type: '兵', color: 'red', position: { x: 3, y: 4 } }
    initialBoard[3][6] = { type: '兵', color: 'red', position: { x: 3, y: 6 } }
    initialBoard[3][8] = { type: '兵', color: 'red', position: { x: 3, y: 8 } }
    
    // 黑方
    initialBoard[9][0] = { type: '车', color: 'black', position: { x: 9, y: 0 } }
    initialBoard[9][1] = { type: '马', color: 'black', position: { x: 9, y: 1 } }
    initialBoard[9][2] = { type: '相', color: 'black', position: { x: 9, y: 2 } }
    initialBoard[9][3] = { type: '仕', color: 'black', position: { x: 9, y: 3 } }
    initialBoard[9][4] = { type: '帅', color: 'black', position: { x: 9, y: 4 } }
    initialBoard[9][5] = { type: '仕', color: 'black', position: { x: 9, y: 5 } }
    initialBoard[9][6] = { type: '相', color: 'black', position: { x: 9, y: 6 } }
    initialBoard[9][7] = { type: '马', color: 'black', position: { x: 9, y: 7 } }
    initialBoard[9][8] = { type: '车', color: 'black', position: { x: 9, y: 8 } }
    initialBoard[7][1] = { type: '炮', color: 'black', position: { x: 7, y: 1 } }
    initialBoard[7][7] = { type: '炮', color: 'black', position: { x: 7, y: 7 } }
    initialBoard[6][0] = { type: '兵', color: 'black', position: { x: 6, y: 0 } }
    initialBoard[6][2] = { type: '兵', color: 'black', position: { x: 6, y: 2 } }
    initialBoard[6][4] = { type: '兵', color: 'black', position: { x: 6, y: 4 } }
    initialBoard[6][6] = { type: '兵', color: 'black', position: { x: 6, y: 6 } }
    initialBoard[6][8] = { type: '兵', color: 'black', position: { x: 6, y: 8 } }

    setBoard(initialBoard)
    setSelectedPiece(null)
    setValidMoves([])
    setCurrentPlayer('red')
    setGameStatus('playing')
    setAiThinking(false)
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
            <h1 className="text-xl font-serif font-bold">AI 象棋</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRestart}
              className="flex items-center gap-1 hover:text-[var(--secondary-color)] transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              <span>重新开始</span>
            </button>
            <button 
              onClick={handleBackHome}
              className="flex items-center gap-1 hover:text-[var(--secondary-color)] transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>首页</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 游戏状态 */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${currentPlayer === 'red' ? 'text-red-600' : 'text-gray-400'}`}>
              红方
            </span>
            <span className="text-xl font-bold">vs</span>
            <span className={`text-xl font-bold ${currentPlayer === 'black' ? 'text-black' : 'text-gray-400'}`}>
              黑方
            </span>
          </div>
          <div className="flex items-center gap-2">
            {aiThinking && (
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="h-4 w-4 animate-spin" />
                <span>AI 思考中...</span>
              </div>
            )}
          </div>
        </div>

        {/* 游戏结果 */}
        {gameStatus !== 'playing' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
              <h2 className="text-2xl font-bold mb-4">
                {gameStatus === 'red_wins' ? '红方胜利！' : '黑方胜利！'}
              </h2>
              <div className="flex gap-4 justify-center mt-6">
                <button 
                  className="btn-primary"
                  onClick={handleRestart}
                >
                  再玩一局
                </button>
                <button 
                  className="btn-secondary"
                  onClick={handleBackHome}
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 棋盘 */}
        <div className="chessboard">
          {board.map((row, x) => (
            row.map((piece, y) => {
              const isLight = (x + y) % 2 === 0
              const isSelected = selectedPiece && selectedPiece.x === x && selectedPiece.y === y
              const isValidMove = validMoves.some(move => move.x === x && move.y === y)
              const hasEnemy = piece && piece.color !== currentPlayer

              return (
                <div
                  key={`${x}-${y}`}
                  className={`chess-square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isValidMove ? (hasEnemy ? 'valid-capture' : 'valid-move') : ''}`}
                  onClick={() => handleSquareClick(x, y)}
                >
                  {piece && (
                    <div className={`chess-piece ${piece.color === 'red' ? 'text-red-600' : 'text-black'}`}>
                      {piece.type}
                    </div>
                  )}
                </div>
              )
            })
          ))}
        </div>

        {/* 游戏信息 */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">游戏信息</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>游戏模式：</strong>{gameMode === 'ai' ? '人机对弈' : '在线对战'}</p>
              {gameMode === 'ai' && (
                <p><strong>难度级别：</strong>{difficulty === 1 ? '简单' : difficulty === 2 ? '中等' : difficulty === 3 ? '困难' : difficulty === 4 ? '专家' : '大师'}</p>
              )}
            </div>
            <div>
              <p><strong>当前回合：</strong>{currentPlayer === 'red' ? '红方' : '黑方'}</p>
              <p><strong>游戏状态：</strong>{gameStatus === 'playing' ? '进行中' : gameStatus === 'red_wins' ? '红方胜利' : '黑方胜利'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game