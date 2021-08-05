import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { IGame } from './Game';

import { SiZeromq, SiXPack } from 'react-icons/si';

interface IProps {
  socket: Socket;
  currentGame: IGame | null;
  setCurrentGame: Dispatch<SetStateAction<IGame | null>>;
}

const Board = ({ socket, currentGame, setCurrentGame }: IProps) => {
  const [gameEnd, setGameEnd] = useState(false);
  /**
   * Register listener functions which fire at certain states of the game.
   *
   * The functions are mainly used to change current view and update data.
   */
  useEffect(() => {
    const boardUpdateListener = (game: IGame) => {
      setCurrentGame(game);
    };

    const endGameListener = (game: IGame) => {
      setCurrentGame(game);
      setGameEnd(true);
    };

    socket.on('update board', boardUpdateListener);
    socket.on('end game', endGameListener);
    return () => {
      socket.off('update board', boardUpdateListener);
      socket.off('end game', endGameListener);
    };
  }, [socket]);

  /**
   * Function which takes the x and y indexes from the board array.
   *
   * Sends the gameId, x and y data to the socket io endpoint.
   */
  const handleSetMark = (x: Number, y: Number) => {
    // console.log(`Set mark at: ${x}, ${y}`);
    if (currentGame != null) {
      socket.emit('set mark', { id: currentGame.id, x, y });
    }
  };

  // Handles leaving the game when the button is clicked
  const handleLeaveGame = () => {
    socket.emit('leave game');
  };

  return (
    <section className="container mx-auto">
      <div className="flex justify-between">
        {/* Display the Naughts player details */}
        <div>
          <div className=" p-5 bg-white rounded-md">
            <h3 className="text-lg">Naughts</h3>
            <p className="font-bold">
              {currentGame?.players[currentGame?.naughtsPlayerIndex].username}
            </p>
          </div>
        </div>
        <div>
          {/* Displays the current game status (needs formatting) */}
          <div className="flex items-center flex-col justify-center pb-5">
            <p className="text-xl text-white pb-3">{currentGame?.status}</p>
            {gameEnd && (
              <button
                onClick={() => handleLeaveGame()}
                className="px-4 py-2 rounded bg-yellow-500"
              >
                Leave Game
              </button>
            )}
          </div>

          <div className="flex flex-col items-center space-y-5">
            {/* Displays the current board data from the state */}
            {currentGame?.board.map((row, y) => (
              <div key={y} className="flex justify-center space-x-5">
                {row.map((col, x) => (
                  <div
                    key={x}
                    onClick={() => handleSetMark(x, y)}
                    className="w-44 h-44 cursor-pointer bg-white rounded-lg shadow-xl inline-flex justify-center items-center p-5 border-4 border-white hover:border-gray-400"
                  >
                    {/* Used to display either an X or Y */}
                    {col != -1 ? (
                      col == 0 ? (
                        <SiZeromq className="text-red-600 w-16 h-16" />
                      ) : (
                        <SiXPack className="text-blue-600 w-16 h-16" />
                      )
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Display the Crosses player details */}
        <div>
          <div className="p-5 bg-white rounded-md">
            <h3 className="text-lg">Crosses</h3>
            <p className="font-bold">
              {currentGame?.players[currentGame?.crossesPlayerIndex].username}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Board;
