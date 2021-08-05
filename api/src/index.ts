import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { Game } from './utils/games';

const port = 8001;

// Initialise express
const app = express();
// Attach cors middleware
app.use(cors());

// Initialise socket io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
interface ISocket extends Socket {
  username?: string;
}

/**
 *  Register a middleware which checks for the username
 *  Then declares property in socket with the username
 */
io.use((socket: ISocket, next) => {
  // gets the username in handshake which was declared by the client when connecting.
  const username = socket.handshake.auth.username;
  // if it doesn't exist in the handshake then return an error.
  if (!username) {
    return next(new Error('invalid username!'));
  }
  // Declares a property in the socket
  socket.username = username;
  next();
});

//  Array that contains all the games.
const games: Game[] = [];

// Runs when client connects
io.on('connection', (socket: ISocket) => {
  console.log('a user connected');

  // User joins the lobby room
  socket.join('lobby');

  // Sends all the current available games to the user.
  socket.emit('connected', games);

  // Event listener which handles creating a game.
  socket.on('create game', () => {
    if (socket.username != undefined) {
      // Creates a new instance of a game
      const newGame = new Game(socket.username, socket.id);
      // Add the game to the games array
      games.push(newGame);
      // User switches room to the game room based on the generated id.
      socket.join(newGame.id);
      // Send the games array to everyone else in the lobby room
      socket.to('lobby').emit('games', games);
      // Sends the user the new game details.
      socket.emit('waiting for player', newGame);
    }
  });

  // Event listener which handles when a user joins an existing game
  socket.on('join game', (id) => {
    // Find the game with the given id
    const game = games.find((v) => v.id === id);
    // Make sure game exists and that the game isn't already full with 2 players.
    if (game != undefined && socket.username != undefined && !game.isFull()) {
      // User switches room to the game room.
      socket.join(game.id);
      // Call the function to add the player in the game instance.
      game.addSecondPlayer(socket.username, socket.id);
      // Update the game to the all the users in the lobby (updates the usernames.)
      socket.to('lobby').emit('games', games);
      // Send the user to the waiting room.
      socket.emit('waiting for player', game);
      // Send players in the game room the new player details.
      socket.to(game.id).emit('player joined', game);
    }
  });

  // Event listener which handles initialising the game.
  socket.on('start game', (id) => {
    // Find the game with the given id
    const game = games.find((v) => v.id === id);
    // Make sure the game exists and the game is full of players.
    if (game != undefined && socket.username != undefined && game.isFull()) {
      // Initialise the game by randomly setting the users to their roles. (Naughts or Crosses)
      game.startGame();
      // Send the players of the game the new details of the game.
      socket.emit('play game', game);
      socket.to(game.id).emit('play game', game);
    }
  });

  // Event listener which handles player turns.
  socket.on(
    'set mark',
    ({ id, x, y }: { id: string; x: number; y: number }) => {
      // Find the game with the given id
      const game = games.find((v) => v.id === id);
      // Make sure game exists.
      if (game != undefined && socket.username != undefined) {
        // Calls the function in the game instance to handle the turn.
        game.playTurn({ x, y, playerId: socket.id });

        // Sends the updated game data to the users.
        socket.emit('update board', game);
        socket.to(game.id).emit('update board', game);

        // Checks if there is a winner
        if (game.checkWinner()) {
          socket.emit('end game', game);
          socket.to(game.id).emit('end game', game);
          socket.to('lobby').emit('games', games);
        }
      }
    }
  );

  // Event listener which handles the a user disconnect.
  socket.on('leave game', () => {
    socket.join('lobby');
    socket.emit('connected', games);
  });

  // Event listener which handles the a user disconnect.
  socket.on('disconnect', () => {
    console.log(`disconnect ${socket.id}`);
  });
});

// run the server.
server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
