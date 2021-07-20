import { useState } from 'react'
import classes from './style/Game.module.scss'
import Board from '../Board/Board'

const Game = () => {
    const [restartGame, setRestartGame] = useState(false)
    const [playerMove, setPlayerMove] = useState(1)
    const [gameState, setGameState] = useState("")

    const changeGameState = () => {
        setRestartGame(false)
        setPlayerMove(prev => prev === 1 ? 2 : 1)
    }

    const finishedGame = (message) => {
        setGameState(message)
        console.log(message)
    }

    const restart = () => {
        setPlayerMove(1)
        setGameState("")
        setRestartGame(true)
    }

    return (
        <div className={classes.gameContainer}>
            <Board
                restartGame={restartGame}
                canPlace={gameState === ""}
                playerMove={playerMove} 
                changeGameStateFunction={changeGameState}
                finishedGame={finishedGame}/>
            <h1>{gameState === "" ? (playerMove === 1 ? "Players 1 move" : "Players 2 move") : gameState}</h1>
            {gameState !== "" && <button onClick={restart}>Restart?</button>}
        </div>
    )
}

export default Game;