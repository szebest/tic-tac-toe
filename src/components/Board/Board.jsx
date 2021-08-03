import { useState, useEffect } from 'react'
import classes from './style/Board.module.scss'
import Tile from '../Tile/Tile'

const Board = ({ restartGame, canPlace, playerMove, changeGameStateFunction, finishedGame, vsAI }) => {
    const CELL_SIZE = 100

    const [board, setBoard] = useState(Array(9).fill(0))
    const [line, setLine] = useState("")

    useEffect(async () => {
        if (restartGame) {
            await setBoard([...Array(9).fill(0)])
            await setLine("")
        }
    }, [restartGame])

    const checkWin = (board) => {
        // Check for cross win
        if (board[0] === board[4] && board[4] === board[8] && board[4] !== 0) {
            return {winningPlayer: board[4], x1: 20, y1: 20, x2: 280, y2: 280}
        }

        if (board[2] === board[4] && board[4] === board[6] && board[4] !== 0) {
            return {winningPlayer: board[4], x1: 280, y1: 20, x2: 20, y2: 280}
        }
        
        // Check for row or column win
        for (let i = 0; i < 3; i++) {
            if (board[i * 3 + 0] === board[i * 3 + 1] && board[i * 3 + 1] === board[i * 3 + 2] && board[i * 3 + 1] !== 0) {
                return {winningPlayer: board[i * 3], x1: 20, y1: 50 + i * 100, x2: 280, y2: 50 + i * 100}
            }

            if (board[0 * 3 + i] === board[1 * 3 + i] && board[1 * 3 + i] === board[2 * 3 + i] && board[1 * 3 + i] !== 0) {
                return {winningPlayer: board[i], x1: 50 + i * 100, y1: 20, x2: 50 + i * 100, y2: 280}
            }
        }

        // Check for a draw
        if (!board.some((value) => value === 0)) 
            return {winningPlayer: 0}
        
        return false
    }

    const bestMove = (board) => {
        // AI to make its turn
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Is the spot available?
                if (board[i * 3 + j] === 0) {
                    board[i * 3 + j] = 2;
                    let score = minimax(board, 0, false);
                    board[i * 3 + j] = 0;
                    if (score > bestScore || Math.random() >= 0.9) {
                        bestScore = score;
                        move = i * 3 + j

                        if (bestScore > 0) {
                            i = 3
                            j = 3
                        }
                    }
                }
            }
        }
        return move
    }

    const minimax = (board, depth, isMaximizing) => {
        let scores = {
            1: -1000 - depth,
            2: 1000 - depth,
            0: 0
        };
        let result = checkWin(board);
        if (result !== false) {
            return scores[result.winningPlayer];
        }
      
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Is the spot available?
                    if (board[i * 3 + j] === 0) {
                        board[i * 3 + j] = 2;
                        let score = minimax(board, depth + 1, false);
                        board[i * 3 + j] = 0;
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } 
        else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Is the spot available?
                    if (board[i * 3 + j] === 0) {
                        board[i * 3 + j] = 1;
                        let score = minimax(board, depth + 1, true);
                        board[i * 3 + j] = 0;
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    useEffect(() => {
        if (restartGame && board.some(el => el !== 0)) {
            setBoard(Array(9).fill(0))
        }
        else if (vsAI && playerMove === 2) {
            let hasMoved = false
            while (!hasMoved) {
                let index = bestMove(board)
                if (board[index] === 0) {
                    hasMoved = true
                    
                    setBoard(prev => {
                        prev[index] = playerMove
                        return prev
                    })
            
                    const boardState = checkWin(board)

                    if (boardState) {
                        const classNames = `${classes.grid} ${classes.fadeIn} ${board[index] === 1 ? classes.gridBlue : classes.gridOrange}`
                        finishedGame(boardState.winningPlayer === 1 ? "X has won!" : boardState.winningPlayer === 0 ? "Draw!" : "O has won!")
                        if (boardState.winningPlayer !== 0)
                            setLine(`<line x1="${boardState.x1}" y1="${boardState.y1}" x2="${boardState.x2}" y2="${boardState.y2}" class="${classNames}"></line>`)
                    }
                    else
                        changeGameStateFunction()
                }
            }
        }
    }, [playerMove, board])

    const handleClick = async (e) => {
        if (!canPlace)
            return
        
        const rect = e.target.getBoundingClientRect()
        const gridX = Math.floor((e.pageX - rect.left) / CELL_SIZE)
        const gridY = Math.floor((e.pageY - rect.top) / CELL_SIZE)

        if (gridX < 0 || gridY < 0)
            return
        
        const index = gridY * 3 + gridX

        if (board[index] === 0) {
            await setBoard(prev => {
                prev[index] = playerMove
                return prev
            })

            let boardState = checkWin(board)

            if (boardState) {
                const classNames = `${classes.grid} ${classes.fadeIn} ${board[index] === 1 ? classes.gridBlue : classes.gridOrange}`
                finishedGame(boardState.winningPlayer === 1 ? "X has won!" : boardState.winningPlayer === 0 ? "Draw!" : "O has won!")
                if (boardState.winningPlayer !== 0)
                    setLine(`<line x1="${boardState.x1}" y1="${boardState.y1}" x2="${boardState.x2}" y2="${boardState.y2}" class="${classNames}"></line>`)
            }
            else
                changeGameStateFunction()
        }
    }

    return (
        <svg width="360" height="360" 
            className={`${classes.board} ${canPlace ? (playerMove === 1 ? classes.blue : classes.orange) : classes.green}`}>
            <g transform="translate(30,30)" onClick={handleClick} id="clickable-area">
                <rect width="300" height="300"></rect>
                <line x1="100" y1="0" x2="100" y2="300" className={classes.grid}></line>
                <line x1="0" y1="100" x2="300" y2="100" className={classes.grid}></line>
                <line x1="200" y1="0" x2="200" y2="300" className={classes.grid}></line>
                <line x1="0" y1="200" x2="300" y2="200" className={classes.grid}></line>
                {board.map((value, index) => {
                    const posx = (index % 3) * 100 + 50
                    const posy = Math.floor(index / 3) * 100 + 50
                    return <Tile key={index} player={value} posx={posx} posy={posy} turn={playerMove}/>
                })}
                <g dangerouslySetInnerHTML={{__html: line}}></g>
            </g>
        </svg>
    )
}

export default Board;