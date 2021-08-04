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
  useEffect(() => {
    const boardUpdateListener = (game: IGame) => {
      console.log('The player board has been updated');
      setCurrentGame(game);
    };

    socket.on('update board', boardUpdateListener);
    return () => {
      socket.off('update board', boardUpdateListener);
    };
  }, [socket]);

  const handleSetMark = (x: Number, y: Number) => {
    console.log(`Set mark at: ${x}, ${y}`);
    if (currentGame != null) {
      socket.emit('set mark', { id: currentGame.id, x, y });
    }
  };

  return (
    <section className="container mx-auto">
      <div className="flex justify-between">
        <div className="flex">
          <div className=" p-5 bg-white rounded-md">
            <h3 className="text-lg">Naughts</h3>
            <p className="font-bold">
              {currentGame?.players[currentGame?.naughtsPlayerIndex].username}
            </p>
          </div>
        </div>
        <div>
          <div className="flex justify-center pb-5">{currentGame?.status}</div>
          <div className="flex flex-col items-center space-y-5">
            {currentGame?.board.map((row, y) => (
              <div key={y} className="flex justify-center space-x-5">
                {row.map((col, x) => (
                  <div
                    key={x}
                    onClick={() => handleSetMark(x, y)}
                    className="w-44 h-44 cursor-pointer bg-white rounded-lg shadow-xl inline-flex justify-center items-center p-5 border-4 border-white hover:border-gray-400"
                  >
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
        <div className="p-5 bg-white rounded-md">
          <h3 className="text-lg">Crosses</h3>
          <p className="font-bold">
            {currentGame?.players[currentGame?.crossesPlayerIndex].username}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Board;
