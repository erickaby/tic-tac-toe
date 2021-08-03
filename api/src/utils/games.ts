enum GameStatus {
    NAUGHTS_TURN,
    CROSSES_TURN,
    DRAW,
    NAUGHTS_WIN,
    CROSSES_WIN,
    PLAYER_DISCONNECTED
}

// initialise game
class Game {
    board: number[][]
    status: GameStatus

    constructor() {
        const emptyBoard = [
            [-1, -1, -1],
            [-1, -1, -1],
            [-1, -1, -1]
        ]
        this.board = emptyBoard
        this.status = GameStatus.CROSSES_TURN
    }

    playTurn({x, y}: {x: number, y: number}) {
        // Check if location has already
        const location = this.board[y][x]
        
        // Play turn
        if (location === -1) {
            if (this.status === GameStatus.CROSSES_TURN) {
                this.board[y][x] = 1
                this.status = GameStatus.NAUGHTS_TURN
            }
            else if (this.status === GameStatus.NAUGHTS_TURN) {
                this.board[y][x] = 0
                this.status = GameStatus.CROSSES_TURN
            }    
        }
        // Check if player won.
    }
}

class Lobby {

}

const games: Game[] = []
const lobbies: Lobby[] = []


export { Game, Lobby }