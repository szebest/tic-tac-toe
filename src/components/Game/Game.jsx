import { useState, useEffect } from 'react'
import classes from './style/Game.module.scss'
import Board from '../Board/Board'

const Game = () => {
    const [restartGame, setRestartGame] = useState(false)
    const [playerMove, setPlayerMove] = useState(1)
    const [gameState, setGameState] = useState("")
    const [score, setScore] = useState({x: 0, o: 0})
    const [vsAI, setVsAI] = useState(null)

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

    const restart = () => {
        setPlayerMove(1)
        setGameState("")
        setRestartGame(true)
        setScore({x: 0, o: 0})
    }

    const resetAI = () => {
        setVsAI(null)
    }

    useEffect(() => {
        setScore({x: 0, o: 0})
        setGameState("")
        setRestartGame(true) 
    }, [vsAI])

    if (vsAI !== null)
        return (
            <div className={classes.gameContainer}>
                <div className={classes.scoreContainer}>
                    <div>
                        <p>{vsAI ? "Player vs AI" : "Player vs Player"}</p>
                    </div>
                    <div className={classes.flex}>
                        <p>x: {score.x}</p>
                        <p>o: {score.o}</p>
                    </div>
                </div>
                <Board
                    restartGame={restartGame}
                    canPlace={gameState === ""}
                    playerMove={playerMove} 
                    changeGameStateFunction={changeGameState}
                    finishedGame={finishedGame}
                    vsAI={vsAI}/>
                <h1 className={classes.infoText}>{gameState === "" ? (playerMove === 1 ? "Players 1 move" : "Players 2 move") : gameState}</h1>
                <div className={classes.buttonContainer}>
                    <button className={`${classes.button} ${classes.buttonPrimary}`} onClick={restart}>Restart</button>
                    <button className={`${classes.button} ${classes.buttonPrimary}`} onClick={resetAI}>Change game mode</button>
                </div>
            </div>
        )
    else {
        return (
            <div className={classes.gameContainer}>
                <button className={`${classes.button} ${classes.buttonPrimary} ${classes.menu}`} onClick={() => setVsAI(false)}>Player vs Player</button>
                <button className={`${classes.button} ${classes.buttonPrimary} ${classes.menu}`} onClick={() => setVsAI(true)}>Player vs AI</button>
            </div>
        )
    }
}

export default Game;