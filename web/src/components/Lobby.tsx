import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { IGame } from './Game';

type IProps = {
  socket: Socket;
  games: IGame[];
  setGames: Dispatch<SetStateAction<IGame[]>>;
};

const Lobby = ({ socket, games, setGames }: IProps) => {
  useEffect(() => {
    const connectedListener = (games: IGame[]) => {
      console.log(games);
      setGames(games);
    };

    const gameListener = (games: IGame[]) => {
      console.log('Game was created!');
      setGames(games);
    };

    socket.on('connected', connectedListener);
    socket.on('games', gameListener);
    return () => {
      socket.off('connected', connectedListener);
      socket.off('games', gameListener);
    };
  }, [socket]);

  const handleCreateGame = () => {
    console.log('Create game btn');
    socket.emit('create game');
  };

  const handleJoinGame = (id: string) => {
    console.log('Join game with id: ', id);
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
          {games.map((game, i) => (
            <div
              key={i}
              className="flex justify-between p-5 bg-white rounded-lg shadow-xl items-center"
            >
              <div className="flex items-center space-x-5">
                <img
                  className="rounded-lg h-16 w-16"
                  src={`http://tinygraphs.com/labs/isogrids/hexa16/player2?theme=heatwave&numcolors=4&size=220&fmt=svg`}
                />
                {game.players.map((player, i) => (
                  <h2 key={i}>{player.username}</h2>
                ))}
              </div>
              <div>
                <button
                  onClick={() => handleJoinGame(game.id)}
                  disabled={game.players.length >= 2}
                  className="px-4 py-2 font-semibold text-sm bg-green-400 text-white rounded-md"
                >
                  Join
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
