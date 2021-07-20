import { useState, useEffect } from 'react'
import classes from './style/Board.module.scss'
import Tile from '../Tile/Tile'

const Board = ({ restartGame, canPlace, playerMove, changeGameStateFunction, finishedGame }) => {
    const CELL_SIZE = 100

    const [board, setBoard] = useState(Array(9).fill(0))
    const [line, setLine] = useState("")

    useEffect(() => {
        if (restartGame) {
            setBoard(Array(9).fill(0))
            setLine("")
        }
    }, [restartGame])

    const checkBoardState = (lastPlacedTile) => {
        // Check for cross win
        const classNames = `${classes.grid} ${classes.fadeIn} ${board[lastPlacedTile] === 1 ? classes.gridBlue : classes.gridOrange}`
        if (board[0] === board[4] && board[4] === board[8] && board[4] !== 0) {
            finishedGame(board[4] === 1 ? "Player 1 has won!" : "Player 2 has won!")
            setLine(`<line x1="20" y1="20" x2="280" y2="280" class="${classNames}"></line>`)
            return true
        }

        if (board[2] === board[4] && board[4] === board[6] && board[4] !== 0) {
            finishedGame(board[4] === 1 ? "Player 1 has won!" : "Player 2 has won!")
            setLine(`<line x1="280" y1="20" x2="20" y2="280" class="${classNames}"></line>`)
            return true
        }
        
        // Check for row or column win
        for (let i = 0; i < 3; i++) {
            if (board[i * 3 + 0] === board[i * 3 + 1] && board[i * 3 + 1] === board[i * 3 + 2] && board[i * 3 + 1] !== 0) {
                finishedGame(board[i * 3] === 1 ? "Player 1 has won!" : "Player 2 has won!")
                setLine(`<line x1="20" y1="${50 + i * 100}" x2="280" y2="${50 + i * 100}" class="${classNames}"></line>`)
                return true
            }

            if (board[0 * 3 + i] === board[1 * 3 + i] && board[1 * 3 + i] === board[2 * 3 + i] && board[1 * 3 + i] !== 0) {
                finishedGame(board[i] === 1 ? "Player 1 has won!" : "Player 2 has won!")
                setLine(`<line x1="${50 + i * 100}" y1="20" x2="${50 + i * 100}" y2="280" class="${classNames}"></line>`)
                return true
            }
        }

        // Check for a draw
        if (!board.some((value) => value === 0)) {
            finishedGame("Draw!")
            return true
        }
        
        return false
    }

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
    
            if (!checkBoardState(index))
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