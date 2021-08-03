import React, { useState, useEffect } from 'react';
import axios from 'axios'
import io, { Socket } from "socket.io-client";
// import Board from './components/Board'
import Game from './components/Game'

function App() {
  const [socket, setSocket] = useState<Socket| null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8001');
    setSocket(newSocket);
    return () => {
      newSocket.disconnect()
    }
  }, [setSocket]);

  const handleStartButton = () => {
    console.log('handle Start buytton')
  }
  
  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen">
      <header className="container mx-auto py-10">
        <div className="flex justify-center">
          <h1 className="text-center text-4xl text-white">Tic Tac Toe</h1>
          
        </div>
      </header>

      {socket ? (
          <Game socket={socket} />
      ) : (
          <div>Not Connected</div>
      )}

      

      {/* <Board url={'ws://localhost:8001'} /> */}
      
    </div>
  );
}

export default App;
