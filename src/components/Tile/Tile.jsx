import classes from './style/Tile.module.scss'

const Tile = ({player, posx, posy}) => {
    const styles = {
        transform: `translate(${posx}px, ${posy}px)` 
    }

    if (player === 1)
        return (
            <g className={classes.fadeIn}>
                <g style={styles} className={classes.player1}>
                    <line x1="-20" y1="-20" x2="20" y2="20"></line>
                    <line x1="-20" y1="20" x2="20" y2="-20"></line>
                </g>
            </g>
        )
    else if (player === 2)
        return (
            <g className={classes.fadeIn}>
                <g style={styles} className={classes.player2}>
                    <circle r="20"></circle>
                </g>
            </g>
        )
    else {
        return (
            <></>
        )
    }
}

export default Tile;