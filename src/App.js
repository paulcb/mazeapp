import { useState } from 'react';
import Maze from './maze.js'

function Square({ borders }) {
  const [value, setValue] = useState(borders.key);
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
        {value}
      </button>
    </>
  );
}

export default function Board() {
  const [maze, mazeBoard] = useState(new Maze());
  // const ENV = process.env;
  // console.log("secret value test: ", ENV);
  return (
    <>
      {maze.board.map((row, i) => (
        <div key={i} className="board-row">
          {row.map(borders => <Square key={borders.key} borders={borders} />)}
        </div>
      ))}
    </>
  );
}
