import express from 'express';
import cors from 'cors'
import http from "http";
import { Server, Socket } from "socket.io";
import { Game } from './utils/games';

const port = 8001;

const app = express();
app.use(cors())

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
});

interface ISocket extends Socket {
    username?: string;
}

// Register a middleware which checks the username
io.use((socket: ISocket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('invalid username!'))
    }
    socket.username = username;
    console.log('socket username:', socket.username)
    next();
})


const games: Game[] = []

// Run when client connects
io.on('connection', (socket: ISocket) => {
    console.log('a user connected');

    // Join the lobby room
    socket.join('lobby');
    // Send the current available games to the user.
    socket.emit("connected", games);

    socket.on('create game', () => {
        console.log('create the game')
        if (socket.username != undefined) {
            const newGame = new Game(socket.username, socket.id)
            games.push(newGame)
            socket.join(newGame.id)
            socket.to('lobby').emit("games", games);
            socket.emit('waiting for player', newGame)
        }
    })

    socket.on('join game', (id) => {
        const game = games.find((v) => v.id === id)
        if (game != undefined && socket.username != undefined && !game.isFull()) {
            socket.join(game.id)
            game.addSecondPlayer(socket.username, socket.id)
            socket.to('lobby').emit("games", games);
            socket.emit('waiting for player', game)
            socket.to(game.id).emit('player joined', game)
        }
    })

    socket.on('start game', (id) => {
        const game = games.find((v) => v.id === id)
        if (game != undefined && socket.username != undefined && game.isFull()) {
            game.startGame()
            console.log('Start Game!')
            socket.emit('play game', game)
            socket.to(game.id).emit('play game', game)
        }
    })

    socket.on('set mark', ({ id, x, y }: { id: string, x: number, y: number }) => {
        const game = games.find((v) => v.id === id)
        if (game != undefined && socket.username != undefined) {
            game.playTurn({ x, y, playerId: socket.id })
            socket.emit('update board', game)
            socket.to(game.id).emit('update board', game)
        }
    })

    socket.on("disconnect", () => {
        console.log(`disconnect ${socket.id}`);
    });
})


server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})