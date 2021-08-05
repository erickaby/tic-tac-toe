import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import Board from './Board';

import CreateUsername from './CreateUsername';
import Lobby from './Lobby';
import WaitingForPlayer from './WaitingForPlayer';

// Enums for the different state of the game.
// Used to display different components.
enum STATUS {
  LOADING,
  CREATE_USER,
  LOBBY,
  WAITING_FOR_PLAYER,
  IN_GAME,
}
// Interface for the Game object which is sent from the socket io endpoint.
export interface IGame {
  players: { username: string; id: string }[];
  board: number[][];
  id: string;
  status: string;
  naughtsPlayerIndex: number;
  crossesPlayerIndex: number;
}

// Props type
// *type is used over interface for recommended practice in react.
type IProps = {
  socket: Socket;
};

const Game = ({ socket }: IProps) => {
  // Initialising the status state.
  // This is used to display the different component views of the game.
  const [status, setStatus] = useState(STATUS.CREATE_USER);

  // Declaring an array which will hold all the games made.
  // Used to display games to the user for them to join.
  const [games, setGames] = useState<IGame[]>([]);

  // Declaring the current game the player is in.
  // This state is used is show all the details of the game the current user is playing.
  const [currentGame, setCurrentGame] = useState<IGame | null>(null);

  /**
   * Register listener functions which fire at certain states of the game.
   *
   * The functions are mainly used to change current view and update data.
   */
  useEffect(() => {
    // function executed once a user has registered a username and
    // connected to the socket io endpoint.
    // The function changes the view to the lobby status.
    const connectedListener = (games: IGame[]) => {
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

    const disconnectListener = () => {
      console.log('Disconnected');
    };

    // register socket io event
    socket.on('connected', connectedListener);
    socket.on('disconnect', disconnectListener);
    socket.on('waiting for player', waitingForPlayerListener);
    socket.on('play game', playGameListener);

    return () => {
      // deregister socket io event
      socket.off('connected', connectedListener);
      socket.off('disconnect', disconnectListener);
      socket.off('waiting for player', waitingForPlayerListener);
      socket.off('play game', playGameListener);
    };
  }, [socket]);

  /**
   * Switch statement which displays a component based on the current status.
   */
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
