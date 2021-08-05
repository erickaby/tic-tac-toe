import { stringify } from 'querystring';
import { v4 as uuidv4 } from 'uuid';

enum GameStatus {
  NAUGHTS_TURN = 'naughts_turn',
  CROSSES_TURN = 'crosses_turn',
  DRAW = 'draw',
  NAUGHTS_WIN = 'naughts_win',
  CROSSES_WIN = 'crosses_win',
  PLAYER_DISCONNECTED = 'player_disconnected',
}

class Game {
  id: string;
  board: number[][];
  status: GameStatus;
  players: { username: string; id: string }[];
  naughtsPlayerIndex: number;
  crossesPlayerIndex: number;

  constructor(username: string, id: string) {
    const emptyBoard = [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ];
    this.id = uuidv4();
    this.board = emptyBoard;
    this.status = GameStatus.CROSSES_TURN;
    this.players = [{ username, id }];
    this.naughtsPlayerIndex = -1;
    this.crossesPlayerIndex = -1;
  }

  /**
   * Adds the second player to the players array
   */
  addSecondPlayer(username: string, id: string) {
    this.players.push({ username, id });
  }

  /**
   * Used to check if players is full.
   */
  isFull() {
    return this.players.length >= 2;
  }

  /**
   * returns if the given id can do their turn.
   */
  isPlayersTurn(id: string) {
    if (this.status === GameStatus.NAUGHTS_TURN) {
      return this.players[this.naughtsPlayerIndex].id === id;
    }
    if (this.status === GameStatus.CROSSES_TURN) {
      return this.players[this.crossesPlayerIndex].id === id;
    }
    return false;
  }

  /**
   * Function which randomly chooses what the players will play.
   */
  startGame() {
    const randomBoolean = Math.random() < 0.5;
    this.naughtsPlayerIndex = randomBoolean ? 1 : 0;
    this.crossesPlayerIndex = !randomBoolean ? 1 : 0;
  }

  /**
   * Used to play a turn based on the playerId and the x and y position.
   */
  playTurn({ x, y, playerId }: { x: number; y: number; playerId: string }) {
    // Check if its the players turn
    if (this.isPlayersTurn(playerId)) {
      const location = this.board[y][x];

      // Check if location pos is empty.
      if (location === -1) {
        if (this.status === GameStatus.CROSSES_TURN) {
          this.board[y][x] = 1;
          this.status = GameStatus.NAUGHTS_TURN;
        } else if (this.status === GameStatus.NAUGHTS_TURN) {
          this.board[y][x] = 0;
          this.status = GameStatus.CROSSES_TURN;
        }
      }
    }
  }

  /**
   * Function which checks if there is any winners and returns the winner or false.
   */
  checkWinner() {
    const winner = (p1: number, p2: number, p3: number) => {
      // flatten the array to be able to use it easier.
      const flatBoard = this.board.reduce((acc, val) => acc.concat(val), []);

      const b1 = flatBoard[p1];
      // Check if p1 is empty
      if (b1 === -1) return false;
      const b2 = flatBoard[p2];
      // Check if p2 isn't p1
      if (b1 !== b2) return false;
      const b3 = flatBoard[p3];
      // Check if p3 isn't p2
      if (b2 !== b3) return false;
      // Needs to parse as string or check condition cannot work.
      return b1 + '';
    };

    const draw = () =>
      !this.board.reduce((acc, val) => acc.concat(val), []).includes(-1) && '2';

    // Check if the board has any winners, using all the positions which are winning positions.
    const check =
      // check for 3-in-a-row horizontally
      winner(0, 1, 2) ||
      winner(3, 4, 5) ||
      winner(6, 7, 8) ||
      // check for 3-in-a-row vertically
      winner(0, 3, 6) ||
      winner(1, 4, 7) ||
      winner(2, 5, 8) ||
      // check for 3-in-a-row diagonally
      winner(0, 4, 8) ||
      winner(6, 4, 2) ||
      draw();
    // Draw

    // If winner, update the game status.
    if (check) {
      // Update status
      if (check === '0') this.status = GameStatus.NAUGHTS_WIN;
      if (check === '1') this.status = GameStatus.CROSSES_WIN;
      if (check === '2') this.status = GameStatus.DRAW;
    }

    return check;
  }
}

export { Game };
