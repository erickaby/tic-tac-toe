import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { IGame } from './Game';

type IProps = {
  socket: Socket;
  games: IGame[];
  setGames: Dispatch<SetStateAction<IGame[]>>;
};

const Lobby = ({ socket, games, setGames }: IProps) => {
  /**
   * Register listener functions which fire at certain states of the game.
   *
   * The functions are mainly used to change current view and update data.
   */
  useEffect(() => {
    const connectedListener = (games: IGame[]) => {
      setGames(games);
    };

    const gameListener = (games: IGame[]) => {
      setGames(games);
    };

    socket.on('connected', connectedListener);
    socket.on('games', gameListener);
    return () => {
      socket.off('connected', connectedListener);
      socket.off('games', gameListener);
    };
  }, [socket]);

  // Sends socket io server that the user wants to create a game
  const handleCreateGame = () => {
    socket.emit('create game');
  };

  // Send socket io server which game the player wishes to join.
  const handleJoinGame = (id: string) => {
    socket.emit('join game', id);
  };

  return (
    <section className="container mx-auto">
      <div>
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-center font-bold text-2xl">Lobby</h1>
          <button
            onClick={() => handleCreateGame()}
            className="bg-white px-4 py-2 rounded-md shadow-xl"
          >
            Create Game
          </button>
        </div>
        <div className="grid gap-3">
          {/* Displays all the current games and their current state. */}
          {games.map((game, i) => (
            <div
              key={i}
              className="flex justify-between p-5 bg-white rounded-lg shadow-xl items-center"
            >
              <div className="flex items-center space-x-10">
                {/* Show the players */}
                {game.players.map((player, i) => (
                  <div key={i}>
                    <p className="text-xs text-gray-500">Player {i + 1}</p>
                    <h2>{player.username}</h2>
                  </div>
                ))}
              </div>
              <div>{game.status}</div>
              {/* Button to join the game */}
              <div>
                <button
                  onClick={() => handleJoinGame(game.id)}
                  disabled={game.players.length >= 2}
                  className={`px-4 py-2 font-semibold text-sm  text-white rounded-md ${
                    game.players.length >= 2 ? 'bg-red-400' : 'bg-green-400'
                  }`}
                >
                  {game.players.length >= 2 ? 'In Game' : 'Join'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Lobby;
