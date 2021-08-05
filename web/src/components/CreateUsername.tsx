import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import { CgArrowLongRight } from 'react-icons/cg';

interface IProps {
  socket: Socket;
}

const CreateUsername = ({ socket }: IProps) => {
  // State for the input field in the html
  const [username, setUsername] = useState<string | null>(null);

  /**
   * Register listener functions which fire at certain states of the game.
   *
   * The functions are mainly used to change current view and update data.
   */
  useEffect(() => {
    // Used to check for any errors when choosing a username.
    const connectErrorListener = (err: { message: string }) => {
      if (err.message === 'invalid username') {
        console.log('username is already selected!');
      }
    };

    socket.on('connect_error', connectErrorListener);
    return () => {
      socket.off('connect_error', connectErrorListener);
    };
  }, [socket]);

  // function to attach the username to the socket io instance and connect to the server.
  const handleCreateUsername = () => {
    socket.auth = { username };
    socket.connect();
  };

  return (
    <section className="container mx-auto">
      <div className="flex justify-center">
        {/* Basic form to handle entering the username */}
        <div className="flex flex-col gap-3 p-5 bg-white rounded-lg shadow-xl items-center">
          <label className="text-gray-800 font-semibold text-xs">
            Enter your player name
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 bg-gray-100 rounded-md w-full border-2 border-gray-200"
            />
          </label>
          <button
            onClick={() => handleCreateUsername()}
            className="inline-flex items-center space-x-3 px-4 py-2 font-semibold text-sm bg-green-400 text-white rounded-md hover:bg-green-600"
          >
            <span>Enter</span>
            <CgArrowLongRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateUsername;
