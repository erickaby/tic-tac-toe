import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

const tinygraphsUrl = 'http://tinygraphs.com/labs/isogrids/hexa16/tinygraphs?theme=heatwave&numcolors=4&size=220&fmt=svg'

interface IProps {
    socket: Socket
}

enum STATUS {
    LOADING,
    LOBBY,
    WAITING_FOR_PLAYER,
    IN_GAME
}

const Game = ({ socket }: IProps) => {
    
    const [status, setStatus] = useState(STATUS.LOBBY)

    useEffect(() => {
        const joinGameListener = () => {

        }

        const startGameListener = () => {
        }

        socket.on('joinGame', joinGameListener)
        socket.on('startGame', startGameListener)


        return () => {
            socket.off('joinGame', joinGameListener)
            socket.off('startGame', startGameListener)
        }
    }, [socket])

    switch (status) {
        case STATUS.LOBBY:
            return <Lobby />
        case STATUS.WAITING_FOR_PLAYER:
            return <WaitingForPlayer />
        default:
            return <Error />
    }
}

const WaitingForPlayer = () => {
    return (<section className="container mx-auto">
            <div className="p-10">
                <h1 className="text-center font-bold text-2xl pb-5">Waiting for another player to join</h1>
                <div className="flex justify-center gap-5">
                    <div className="text-center p-5 bg-white rounded-lg shadow-xl">
                        <img className="rounded-lg h-32 w-32" src={`http://tinygraphs.com/labs/isogrids/hexa16/player1?theme=bythepool&numcolors=4&size=220&fmt=svg`} />
                        <h2>Player 1</h2>
                    </div>
                    <div className="text-center p-5 bg-white rounded-lg shadow-xl">
                        <img className="rounded-lg h-32 w-32" src={`http://tinygraphs.com/labs/isogrids/hexa16/player2?theme=heatwave&numcolors=4&size=220&fmt=svg`} />
                        <h2>Player 2</h2>
                    </div>
                </div>
            </div>
        </section>)
}

const Lobby = () => {
    return (<section className="container mx-auto">
        <div>
            <div className="flex justify-between items-center pb-4">
                <h1 className="text-center font-bold text-2xl">Lobby</h1>
                <button className="bg-white px-4 py-2 rounded-md shadow-xl">Create Game</button>
            </div>
                <div className="grid gap-3">
                    <div className="flex justify-between p-5 bg-white rounded-lg shadow-xl items-center">
                        <div className="flex items-center space-x-5">
                        <img className="rounded-lg h-16 w-16" src={`http://tinygraphs.com/labs/isogrids/hexa16/player2?theme=heatwave&numcolors=4&size=220&fmt=svg` }/>
                         <h2>Player 2</h2>
                        </div>
                        <div>
                            <button className="px-4 py-2 font-semibold text-sm bg-green-400 text-white rounded-md">Join</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>)
}

const Error = () => {
    return (
        <section className="container mx-auto">
            <p>There was an error please reload your browser!</p>
        </section>
    )
}

export default Game
