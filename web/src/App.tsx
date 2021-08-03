import React, { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

function App() {
  const [socketUrl, setSocketUrl] = useState('ws://localhost:8001/game');

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const handleStartButton = () => sendMessage('start')

  const [board, setBoard] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ])

  const handleSetMark = (x: Number, y: Number) => {
    console.log(`Set mark at: ${x}, ${y}`)
    sendJsonMessage({x, y})
  }
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="container mx-auto">
        <span>The WebSocket is currently {connectionStatus}</span>
        <button onClick={handleStartButton}>Start Game</button>
        {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <section className="container mx-auto">
        <div className="flex flex-col items-center space-y-5">
          {board.map((row, y) => (<div className="flex justify-center space-x-5">
            {row.map((col, x) => (<div onClick={() => handleSetMark(x, y)} className="w-44 h-44 cursor-pointer bg-white rounded-lg shadow-xl inline-flex justify-center items-center p-5 border-4 border-white hover:border-gray-400">{ col }</div>))}
          </div>))}
        </div>
      </section>
      
    </div>
  );
}

export default App;
