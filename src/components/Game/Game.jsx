import { useState, useEffect } from 'react'
import classes from './style/Game.module.scss'
import Board from '../Board/Board'

const Game = () => {
    const [playerStart, setPlayerStart] = useState(1)
    const [restartGame, setRestartGame] = useState(false)
    const [playerMove, setPlayerMove] = useState(playerStart)
    const [gameState, setGameState] = useState("")
    const [score, setScore] = useState({x: 0, o: 0})
    const [vsAI, setVsAI] = useState(null)

    const changeGameState = () => {
        setRestartGame(false)
        setPlayerMove(prev => prev === 1 ? 2 : 1)
    }

    const finishedGame = (message) => {
        if (message.includes("X"))
            setScore(prev => {
                return {
                    ...prev,
                    x: prev.x + 1
                }
            })
        else if (message.includes("O")) 
            setScore(prev => {
                return {
                    ...prev,
                    o: prev.o + 1
                }
            })

        //localStorage.setItem("score", score)
            
        setGameState(message)
    }

    const newGame = () => {
        setPlayerMove(playerStart === 1 ? 2 : 1)
        setPlayerStart(prev => prev === 1 ? 2 : 1)
        setGameState("")
        setRestartGame(true)
    }

    const resetAI = () => {
        setVsAI(null)
    }

    useEffect(() => {
        setPlayerMove(1)
        setScore({x: 0, o: 0})
        setGameState("")
        setRestartGame(true)
        //localStorage.setItem("vsAI", vsAI)
    }, [vsAI])

    useEffect(() => {
        //let tmpVsAI = localStorage.getItem("vsAI")
        //let tmpScore = localStorage.getItem("score")

        //console.log(tmpVsAI)
        //console.log(tmpScore)
    }, [])

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
                    <button className={`${classes.button} ${classes.buttonPrimary}`} onClick={newGame}>New game</button>
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