import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import { CgArrowLongRight } from 'react-icons/cg';

interface IProps {
  socket: Socket;
}

const CreateUsername = ({ socket }: IProps) => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const connectErrorListener = (err: { message: string }) => {
      if (err.message === 'invalid username') {
        console.log('username is already selected!');
      }
    };
    const connectedListener = (message: any) => {
      console.log(message);
    };

    socket.on('users', connectedListener);
    socket.on('connect_error', connectErrorListener);
    return () => {
      socket.off('users', connectedListener);
      socket.off('connect_error', connectErrorListener);
    };
  }, [socket]);

  const handleCreateUsername = () => {
    socket.auth = { username };
    socket.connect();
  };

  return (
    <section className="container mx-auto">
      <div className="flex justify-center">
        <div className="flex flex-col gap-3 p-5 bg-white rounded-lg shadow-xl items-center">
          {/* <img
            className="rounded-lg h-16 w-16"
            src={`http://tinygraphs.com/labs/isogrids/hexa16/player2?theme=heatwave&numcolors=4&size=220&fmt=svg`}
          /> */}
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
