// 象棋 AI 逻辑

// 评估不同棋子的价值
const PIECE_VALUES = {
  '帅': 10000,
  '将': 10000,
  '仕': 10,
  '士': 10,
  '相': 10,
  '象': 10,
  '马': 30,
  '车': 50,
  '炮': 30,
  '兵': 2,
  '卒': 2
};

// 棋子在棋盘上的位置权重
const POSITION_WEIGHTS = {
  '将': [
    [0, 0, 0, 10, 10, 10, 0, 0, 0],
    [0, 0, 0, 10, 20, 10, 0, 0, 0],
    [0, 0, 0, 5, 5, 5, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  '帅': [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 5, 5, 5, 0, 0, 0],
    [0, 0, 0, 10, 20, 10, 0, 0, 0],
    [0, 0, 0, 10, 10, 10, 0, 0, 0]
  ],
  '卒': [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5, 5],
    [8, 8, 8, 10, 10, 10, 8, 8, 8],
    [10, 10, 15, 15, 18, 15, 15, 10, 10],
    [15, 18, 20, 25, 28, 25, 20, 18, 15],
    [20, 25, 30, 35, 40, 35, 30, 25, 20],
    [25, 30, 35, 40, 45, 40, 35, 30, 25],
    [30, 35, 40, 45, 50, 45, 40, 35, 30]
  ],
  '兵': [
    [30, 35, 40, 45, 50, 45, 40, 35, 30],
    [25, 30, 35, 40, 45, 40, 35, 30, 25],
    [20, 25, 30, 35, 40, 35, 30, 25, 20],
    [15, 18, 20, 25, 28, 25, 20, 18, 15],
    [10, 10, 15, 15, 18, 15, 15, 10, 10],
    [8, 8, 8, 10, 10, 10, 8, 8, 8],
    [5, 5, 5, 5, 5, 5, 5, 5, 5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  '马': [
    [5, 10, 15, 15, 10, 5, 5, 5, 5],
    [8, 12, 18, 20, 18, 12, 8, 8, 8],
    [12, 18, 22, 25, 22, 18, 12, 12, 12],
    [15, 20, 25, 28, 25, 20, 15, 15, 15],
    [12, 18, 22, 25, 22, 18, 12, 12, 12],
    [12, 18, 22, 25, 22, 18, 12, 12, 12],
    [15, 20, 25, 28, 25, 20, 15, 15, 15],
    [12, 18, 22, 25, 22, 18, 12, 12, 12],
    [8, 12, 18, 20, 18, 12, 8, 8, 8],
    [5, 10, 15, 15, 10, 5, 5, 5, 5]
  ],
  '车': [
    [45, 48, 50, 52, 52, 50, 48, 48, 45],
    [48, 50, 52, 54, 54, 52, 50, 50, 48],
    [50, 52, 54, 56, 56, 54, 52, 52, 50],
    [52, 54, 56, 58, 58, 56, 54, 54, 52],
    [54, 56, 58, 60, 60, 58, 56, 56, 54],
    [54, 56, 58, 60, 60, 58, 56, 56, 54],
    [52, 54, 56, 58, 58, 56, 54, 54, 52],
    [50, 52, 54, 56, 56, 54, 52, 52, 50],
    [48, 50, 52, 54, 54, 52, 50, 50, 48],
    [45, 48, 50, 52, 52, 50, 48, 48, 45]
  ],
  '炮': [
    [30, 32, 34, 36, 38, 36, 34, 32, 30],
    [32, 34, 36, 38, 40, 38, 36, 34, 32],
    [34, 36, 38, 40, 42, 40, 38, 36, 34],
    [36, 38, 40, 42, 44, 42, 40, 38, 36],
    [38, 40, 42, 44, 46, 44, 42, 40, 38],
    [38, 40, 42, 44, 46, 44, 42, 40, 38],
    [36, 38, 40, 42, 44, 42, 40, 38, 36],
    [34, 36, 38, 40, 42, 40, 38, 36, 34],
    [32, 34, 36, 38, 40, 38, 36, 34, 32],
    [30, 32, 34, 36, 38, 36, 34, 32, 30]
  ],
  '象': [
    [20, 0, 22, 0, 20, 0, 22, 0, 20],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [22, 0, 24, 0, 22, 0, 24, 0, 22],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [24, 0, 26, 0, 24, 0, 26, 0, 24],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  '相': [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [24, 0, 26, 0, 24, 0, 26, 0, 24],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [22, 0, 24, 0, 22, 0, 24, 0, 22],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [20, 0, 22, 0, 20, 0, 22, 0, 20]
  ],
  '士': [
    [0, 0, 0, 15, 0, 15, 0, 0, 0],
    [0, 0, 0, 0, 18, 0, 0, 0, 0],
    [0, 0, 0, 18, 0, 18, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  '仕': [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 18, 0, 18, 0, 0, 0],
    [0, 0, 0, 0, 18, 0, 0, 0, 0],
    [0, 0, 0, 15, 0, 15, 0, 0, 0]
  ]
};

// 复制棋盘
function copyBoard(board) {
  return board.map(row => row.map(piece => piece ? {...piece} : null));
}

// 评估棋盘局面（黑方视角）
function evaluateBoard(board) {
  let score = 0;
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece) {
        let pieceValue = PIECE_VALUES[piece.type] || 0;
        
        let posWeight = 0;
        if (POSITION_WEIGHTS[piece.type] && POSITION_WEIGHTS[piece.type][row]) {
          posWeight = POSITION_WEIGHTS[piece.type][row][col] || 0;
        }
        
        if (piece.color === 'black') {
          score += pieceValue + posWeight;
        } else {
          score -= pieceValue + posWeight;
        }
      }
    }
  }
  
  return score;
}

// 简单 AI - 随机移动
function simpleAiMove(board, getValidMoves) {
  const blackPieces = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.color === 'black') {
        blackPieces.push({ row, col });
      }
    }
  }

  if (blackPieces.length === 0) return null;

  const validMoves = [];
  for (const piecePos of blackPieces) {
    const piece = board[piecePos.row][piecePos.col];
    const moves = getValidMoves(board, piece, piecePos.row, piecePos.col);
    for (const move of moves) {
      validMoves.push({
        fromRow: piecePos.row,
        fromCol: piecePos.col,
        toRow: move.row,
        toCol: move.col
      });
    }
  }

  if (validMoves.length === 0) return null;

  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

// 贪心 AI - 选择最好的一步
function greedyAiMove(board, getValidMoves) {
  const blackPieces = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.color === 'black') {
        blackPieces.push({ row, col });
      }
    }
  }

  let bestMove = null;
  let bestScore = -Infinity;

  for (const piecePos of blackPieces) {
    const piece = board[piecePos.row][piecePos.col];
    const moves = getValidMoves(board, piece, piecePos.row, piecePos.col);
    
    for (const move of moves) {
      const newBoard = copyBoard(board);
      newBoard[move.row][move.col] = newBoard[piecePos.row][piecePos.col];
      newBoard[piecePos.row][piecePos.col] = null;

      const score = evaluateBoard(newBoard);

      if (score > bestScore) {
        bestScore = score;
        bestMove = {
          fromRow: piecePos.row,
          fromCol: piecePos.col,
          toRow: move.row,
          toCol: move.col
        };
      }
    }
  }

  if (!bestMove) {
    return simpleAiMove(board, getValidMoves);
  }

  return bestMove;
}

// 获取棋子有效移动（用于AI）
function getValidMovesForAi(boardState, piece, row, col) {
  const moves = [];
  const { type, color } = piece;

  switch (type) {
    case '帅':
    case '将':
      const palaceRows = color === 'red' ? [7, 8, 9] : [0, 1, 2];
      const palaceCols = [3, 4, 5];
      
      const kingDirs = [{ dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }];
      for (const { dr, dc } of kingDirs) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (palaceRows.includes(newRow) && palaceCols.includes(newCol)) {
          const targetPiece = boardState[newRow][newCol];
          if (!targetPiece || targetPiece.color !== color) {
            moves.push({ row: newRow, col: newCol });
          }
        }
      }
      break;

    case '仕':
    case '士':
      const advisorPalaceRows = color === 'red' ? [7, 8, 9] : [0, 1, 2];
      const advisorPalaceCols = [3, 4, 5];
      
      const advisorDirs = [{ dr: -1, dc: -1 }, { dr: -1, dc: 1 }, { dr: 1, dc: -1 }, { dr: 1, dc: 1 }];
      for (const { dr, dc } of advisorDirs) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (advisorPalaceRows.includes(newRow) && advisorPalaceCols.includes(newCol)) {
          const targetPiece = boardState[newRow][newCol];
          if (!targetPiece || targetPiece.color !== color) {
            moves.push({ row: newRow, col: newCol });
          }
        }
      }
      break;

    case '相':
    case '象':
      const minRow = color === 'red' ? 5 : 0;
      const maxRow = color === 'red' ? 9 : 4;
      
      const elephantDirs = [{ dr: -2, dc: -2 }, { dr: -2, dc: 2 }, { dr: 2, dc: -2 }, { dr: 2, dc: 2 }];
      for (const { dr, dc } of elephantDirs) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= minRow && newRow <= maxRow && newCol >= 0 && newCol < 9) {
          const eyeRow = row + dr / 2;
          const eyeCol = col + dc / 2;
          if (!boardState[eyeRow][eyeCol]) {
            const targetPiece = boardState[newRow][newCol];
            if (!targetPiece || targetPiece.color !== color) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        }
      }
      break;

    case '马':
      const horseDirs = [
        { dr: -2, dc: -1, blockDr: -1, blockDc: 0 },
        { dr: -2, dc: 1, blockDr: -1, blockDc: 0 },
        { dr: -1, dc: -2, blockDr: 0, blockDc: -1 },
        { dr: -1, dc: 2, blockDr: 0, blockDc: 1 },
        { dr: 1, dc: -2, blockDr: 0, blockDc: -1 },
        { dr: 1, dc: 2, blockDr: 0, blockDc: 1 },
        { dr: 2, dc: -1, blockDr: 1, blockDc: 0 },
        { dr: 2, dc: 1, blockDr: 1, blockDc: 0 }
      ];
      
      for (const { dr, dc, blockDr, blockDc } of horseDirs) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
          const blockRow = row + blockDr;
          const blockCol = col + blockDc;
          if (!boardState[blockRow][blockCol]) {
            const targetPiece = boardState[newRow][newCol];
            if (!targetPiece || targetPiece.color !== color) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        }
      }
      break;

    case '车':
      const rookDirs = [{ dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }];
      
      for (const { dr, dc } of rookDirs) {
        let newRow = row + dr;
        let newCol = col + dc;
        while (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
          const targetPiece = boardState[newRow][newCol];
          if (!targetPiece) {
            moves.push({ row: newRow, col: newCol });
          } else {
            if (targetPiece.color !== color) {
              moves.push({ row: newRow, col: newCol });
            }
            break;
          }
          newRow += dr;
          newCol += dc;
        }
      }
      break;

    case '炮':
      const cannonDirs = [{ dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }];
      
      for (const { dr, dc } of cannonDirs) {
        let newRow = row + dr;
        let newCol = col + dc;
        let hasJumped = false;
        while (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
          const targetPiece = boardState[newRow][newCol];
          if (!targetPiece) {
            if (!hasJumped) {
              moves.push({ row: newRow, col: newCol });
            }
          } else {
            if (!hasJumped) {
              hasJumped = true;
            } else {
              if (targetPiece.color !== color) {
                moves.push({ row: newRow, col: newCol });
              }
              break;
            }
          }
          newRow += dr;
          newCol += dc;
        }
      }
      break;

    case '兵':
    case '卒':
      const forward = color === 'red' ? -1 : 1;
      const crossedRiver = color === 'red' ? row <= 4 : row >= 5;
      
      const newRowForward = row + forward;
      if (newRowForward >= 0 && newRowForward < 10) {
        const targetPiece = boardState[newRowForward][col];
        if (!targetPiece || targetPiece.color !== color) {
          moves.push({ row: newRowForward, col: col });
        }
      }
      
      if (crossedRiver) {
        const sideDirs = [-1, 1];
        for (const dc of sideDirs) {
          const newCol = col + dc;
          if (newCol >= 0 && newCol < 9) {
            const targetPiece = boardState[row][newCol];
            if (!targetPiece || targetPiece.color !== color) {
              moves.push({ row: row, col: newCol });
            }
          }
        }
      }
      break;
  }

  return moves;
}

// 根据难度选择 AI
function getAiMove(difficulty, board, getValidMoves) {
  switch(difficulty) {
    case 1:
      return simpleAiMove(board, getValidMovesForAi);
    case 2:
      if (Math.random() < 0.4) {
        return simpleAiMove(board, getValidMovesForAi);
      } else {
        return greedyAiMove(board, getValidMovesForAi);
      }
    case 3:
    case 4:
    case 5:
    default:
      return greedyAiMove(board, getValidMovesForAi);
  }
}