import { useState } from 'react'
import classes from './style/Game.module.scss'
import Board from '../Board/Board'

const Game = () => {
    const [restartGame, setRestartGame] = useState(false)
    const [playerMove, setPlayerMove] = useState(1)
    const [gameState, setGameState] = useState("")
    const [score, setScore] = useState({x: 0, o: 0})

    const changeGameState = () => {
        setRestartGame(false)
        setPlayerMove(prev => prev === 1 ? 2 : 1)
    }

    const finishedGame = (message) => {
        if (message.includes("1"))
            setScore(prev => {
                return {
                    ...prev,
                    x: prev.x + 1
                }
            })
        else if (message.includes("2")) 
            setScore(prev => {
                return {
                    ...prev,
                    o: prev.o + 1
                }
            })
        setGameState(message)
    }

    const newGame = () => {
        setPlayerMove(1)
        setGameState("")
        setRestartGame(true)
    }

    return (
        <div className={classes.gameContainer}>
            <div className={classes.scoreContainer}>
                <p>x: {score.x}</p>
                <p>o: {score.o}</p>
            </div>
            <Board
                restartGame={restartGame}
                canPlace={gameState === ""}
                playerMove={playerMove} 
                changeGameStateFunction={changeGameState}
                finishedGame={finishedGame}/>
            <h1 className={classes.infoText}>{gameState === "" ? (playerMove === 1 ? "Players 1 move" : "Players 2 move") : gameState}</h1>
            <div className={classes.buttonContainer}>
                {gameState !== "" && <button className={`${classes.button} ${classes.buttonPrimary}`} onClick={newGame}>New game</button>}
                {/*add functionality to changing mode later, when there will be more game modes*/}
                {/*gameState !== "" && <button className={`${classes.button} ${classes.buttonPrimary}`}>Change game mode</button>*/}
            </div>
        </div>
    )
}

export default Game;