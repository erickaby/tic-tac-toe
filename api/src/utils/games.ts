import { v4 as uuidv4 } from 'uuid'
enum GameStatus {
    NAUGHTS_TURN = 'naughts_turn',
    CROSSES_TURN = 'crosses_turn',
    DRAW = 'draw',
    NAUGHTS_WIN = 'naughts_win',
    CROSSES_WIN = 'crosses_win',
    PLAYER_DISCONNECTED = 'player_disconnected'
}

// initialise game
class Game {
    id: string
    board: number[][]
    status: GameStatus
    players: { username: string, id: string }[]
    naughtsPlayerIndex: number
    crossesPlayerIndex: number

    constructor(username:string, id:string) {
        const emptyBoard = [
            [-1, -1, -1],
            [-1, -1, -1],
            [-1, -1, -1]
        ]
        this.id = uuidv4()
        this.board = emptyBoard
        this.status = GameStatus.CROSSES_TURN
        this.players = [{ username, id }]
        this.naughtsPlayerIndex = -1
        this.crossesPlayerIndex = -1
    }

    addSecondPlayer(username: string, id: string) {
        this.players.push({username, id})
    }

    isFull() {
        return this.players.length >= 2
    }

    isPlayersTurn(id: string) {
        if (this.status === GameStatus.NAUGHTS_TURN) {
            return this.players[this.naughtsPlayerIndex].id === id
        }
        if (this.status === GameStatus.CROSSES_TURN) {
            return this.players[this.crossesPlayerIndex].id === id
        }
        return false
    }

    startGame() {
        const randomBoolean = Math.random() < 0.5
        this.naughtsPlayerIndex = randomBoolean ? 1 : 0
        this.crossesPlayerIndex = !randomBoolean ? 1 : 0
    }

    playTurn({x, y, playerId}: {x: number, y: number, playerId: string}) {

        if (this.isPlayersTurn(playerId)) {
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
            const winner = this.checkWinner()
            console.log(winner)
            if (winner) {
                winner == 1 ? this.status = GameStatus.CROSSES_WIN : GameStatus.NAUGHTS_WIN
            }
            // Check if player won.
        }
        
    }

    checkWinner() {
        const winner = (p1: number, p2: number, p3: number) => {
            const flatBoard = this.board.reduce((acc, val) => acc.concat(val), []);
            const b1 = flatBoard[p1];
            if (b1 == -1) return false
            const b2 = flatBoard[p2]
            if (b1 != b2) return false
            const b3 = flatBoard[p3]
            if (b2 != b3) return false
            return b1;
        }
                return winner(0,1,2)  // check for 3-in-a-row horizontally
                ||  winner(3,4,5) 
                ||  winner(6,7,8) 
                ||  winner(0,3,6)  // check for 3-in-a-row vertically
                ||  winner(1,4,7) 
                ||  winner(2,5,8) 
                ||  winner(0,4,8)  // check for 3-in-a-row diagonally
                ||  winner(6,4,2)
                // ||  winner();
       
    }


}

class Lobby {

}


const lobbies: Lobby[] = []


export { Game, Lobby }