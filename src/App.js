import { useState } from 'react';
import Maze from './maze.js'
import { testMaze } from './maze-test.js';

function Square({ borders, mapKey }) {
  const [value, setValue] = useState(null);
  // const [borders, setborders] = useState(bordersIn);
  function handleClick() {
    setValue('x');
  }
  // console.log("borders", borders);
  return (
    <>
      <button
        className="square"
        onClick={handleClick}
        style={{
          borderTop: `${borders.up}px solid #999`,
          borderBottom: `${borders.down}px solid #999`,
          borderLeft: `${borders.left}px solid #999`,
          borderRight: `${borders.right}px solid #999`,
          fontSize: 8,
        }}
      >
        {borders.key}
      </button>
    </>
  );
}

const maze = new Maze(testMaze);

export default function Board() {
  // const ENV = process.env;
  // console.log("env: ", ENV);
  return (
    <>
      {maze.board.map((row, i) => (
        <div key={i} className="board-row">
          {row.map((borders, j) => <Square key={borders.key} borders={borders} mapKey={`${i} ${j}`} />)}
        </div>
      ))}
    </>
  );
}
