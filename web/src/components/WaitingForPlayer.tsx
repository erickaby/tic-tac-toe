import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { IGame } from './Game';

type IProps = {
  socket: Socket;
  currentGame: IGame | null;
  setCurrentGame: Dispatch<SetStateAction<IGame | null>>;
};

const WaitingForPlayer = ({ socket, currentGame, setCurrentGame }: IProps) => {
  useEffect(() => {
    const playerJoinedListener = (game: IGame) => {
      console.log('Another player has joined your game');
      setCurrentGame(game);
    };

    socket.on('player joined', playerJoinedListener);
    return () => {
      socket.off('player joined', playerJoinedListener);
    };
  }, [socket]);

  const handleStartGame = () => {
    if (currentGame) {
      socket.emit('start game', currentGame.id);
    }
  };

  return (
    <section className="container mx-auto">
      {currentGame && (
        <div className="p-10">
          <h1 className="text-center font-bold text-2xl pb-5">
            {currentGame.players.length > 1
              ? 'Click the button to start the game!'
              : 'Waiting for another player to join!'}
          </h1>
          <div className="flex justify-center gap-5">
            <div className="flex flex-col items-center justify-center text-center p-5 w-44 bg-white rounded-lg shadow-xl">
              <img
                className="rounded-lg h-32 w-32"
                src={`http://tinygraphs.com/labs/isogrids/hexa16/player1?theme=bythepool&numcolors=4&size=220&fmt=svg`}
              />
              <h2>{currentGame.players[0].username}</h2>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-5 w-44 bg-white rounded-lg shadow-xl">
              {currentGame.players.length > 1 ? (
                <div>
                  <img
                    className="rounded-lg h-32 w-32"
                    src={`http://tinygraphs.com/labs/isogrids/hexa16/player2?theme=heatwave&numcolors=4&size=220&fmt=svg`}
                  />
                  <h2>{currentGame.players[1].username}</h2>
                </div>
              ) : (
                <div>Waiting</div>
              )}
            </div>
          </div>
          <div className="flex justify-center pt-5">
            {currentGame.players.length > 1 && (
              <button
                onClick={() => handleStartGame()}
                className="text-center bg-red-500 px-4 py-2 rounded-md shadow-lg text-white text-sm"
              >
                Start Game!
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default WaitingForPlayer;
