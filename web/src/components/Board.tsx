import React, { useEffect, useState } from 'react'


interface IProps {
    url: string
}

const Board = (props: IProps) => {
    

    const [board, setBoard] = useState([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ])

    
    
    const handleSetMark = (x: Number, y: Number) => {
        console.log(`Set mark at: ${x}, ${y}`)
      }

    return (
        <section className="container mx-auto">
            
        <div className="flex flex-col items-center space-y-5">
          {board.map((row, y) => (<div className="flex justify-center space-x-5">
            {row.map((col, x) => (<div onClick={() => handleSetMark(x, y)} className="w-44 h-44 cursor-pointer bg-white rounded-lg shadow-xl inline-flex justify-center items-center p-5 border-4 border-white hover:border-gray-400">{ col }</div>))}
          </div>))}
        </div>
      </section>
    )
}

export default Board
