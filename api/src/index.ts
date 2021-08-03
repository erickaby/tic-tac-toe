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



// Run when client connects
io.on('connection', (socket: Socket) => {
    console.log('a user connected');


    socket.on('joinLobby', () => {

        // Give the current user a message.
        socket.emit('message', 'Welcome to the game.')

        // Broadcast when a user connects.
        // socket.broadcast
        //     .to(user.game)
        //     .emit('message', `${user.username} has joined the game`)
        
        // io.to(user.game).emit()
    })
})


server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})