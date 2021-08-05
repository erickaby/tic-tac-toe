import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import Game from './components/Game';

function App() {
  // Socket IO instance
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialise connection to the socket io endpoint and declare the socket state.
  useEffect(() => {
    const Url = process.env.REACT_APP_SERVER_URL || 'http://localhost:8001';
    const newSocket = io(Url, { autoConnect: false });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [setSocket]);

  // Get all events coming from the socket io endpoint and log them to console.
  // Used for debugging (remove for production)
  useEffect(() => {
    socket?.onAny((event, ...args) => {
      console.log(event, args);
    });
    return () => {
      socket?.offAny();
    };
  }, [socket]);

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen">
      {/* Header */}
      <header className="container mx-auto py-10">
        <div className="flex justify-center">
          <h1 className="text-center text-4xl text-white">Tic Tac Toe</h1>
        </div>
      </header>

      {/* Display Game Component if the socket state is initialised. */}
      {socket ? (
        <Game socket={socket} />
      ) : (
        <div className="flex justify-center">Socket not initialised.</div>
      )}
    </div>
  );
}

export default App;
