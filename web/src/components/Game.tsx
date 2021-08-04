import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import Board from './Board';

import CreateUsername from './CreateUsername';
import Lobby from './Lobby';
import WaitingForPlayer from './WaitingForPlayer';

const tinygraphsUrl =
  'http://tinygraphs.com/labs/isogrids/hexa16/tinygraphs?theme=heatwave&numcolors=4&size=220&fmt=svg';

enum STATUS {
  LOADING,
  CREATE_USER,
  LOBBY,
  WAITING_FOR_PLAYER,
  IN_GAME,
}
export interface IGame {
  players: { username: string; id: string }[];
  board: number[][];
  id: string;
  status: string;
  naughtsPlayerIndex: number;
  crossesPlayerIndex: number;
}

type IProps = {
  socket: Socket;
};

const Game = ({ socket }: IProps) => {
  const [status, setStatus] = useState(STATUS.CREATE_USER);

  const [games, setGames] = useState<IGame[]>([]);

  const [currentGame, setCurrentGame] = useState<IGame | null>(null);

  useEffect(() => {
    const connectedListener = (games: IGame[]) => {
      console.log(games);
      setGames(games);
      setStatus(STATUS.LOBBY);
    };

    const waitingForPlayerListener = (game: IGame) => {
      setCurrentGame(game);
      setStatus(STATUS.WAITING_FOR_PLAYER);
    };

    const playGameListener = (game: IGame) => {
      setCurrentGame(game);
      setStatus(STATUS.IN_GAME);
    };

    socket.on('connected', connectedListener);
    socket.on('waiting for player', waitingForPlayerListener);
    socket.on('play game', playGameListener);
    return () => {
      socket.off('connected', connectedListener);
      socket.off('waiting for player', waitingForPlayerListener);
      socket.off('play game', playGameListener);
    };
  }, [socket]);

  switch (status) {
    case STATUS.CREATE_USER:
      return <CreateUsername socket={socket} />;
    case STATUS.LOBBY:
      return <Lobby socket={socket} games={games} setGames={setGames} />;
    case STATUS.WAITING_FOR_PLAYER:
      return (
        <WaitingForPlayer
          socket={socket}
          currentGame={currentGame}
          setCurrentGame={setCurrentGame}
        />
      );
    case STATUS.IN_GAME:
      return (
        <Board
          socket={socket}
          currentGame={currentGame}
          setCurrentGame={setCurrentGame}
        />
      );
    default:
      return <Error />;
  }
};

const Error = () => {
  return (
    <section className="container mx-auto">
      <p>There was an error please reload your browser!</p>
    </section>
  );
};

export default Game;
