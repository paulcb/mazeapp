import React, { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import Maze from './maze.js'
import { testMaze } from './maze-test.js';

// const UserContext = React.createContext(null);

const maze = new Maze(testMaze);
let lastSquare = null;
let offPath = false;
function Square({ borders, mapKey }) {
  const [value, setValue] = useState(null);
  // const { lastSquare, setLastSquare } = useContext(UserContext);
  // const [borders, setborders] = useState(bordersIn);
  function onMouseEnter() {
    if (lastSquare == null) return;
    console.log("lastSquare", lastSquare);
    console.log("mapKey", mapKey);
    
    const neighbors = maze.neighbors(lastSquare);
    console.log("neighbors", neighbors);

    if (!(mapKey == neighbors.up || mapKey == neighbors.down || mapKey == neighbors.left || mapKey == neighbors.right)) {
      offPath = true;
      return;
    };
    offPath = false;
    setValue('X');
  }

  function onMouseLeave() {
    if(offPath) return;
    lastSquare = mapKey;
    offPath = false;
  }

  useEffect(() => {
    setValue("");
    const handleLoad = () => {
      console.log('Page has fully loaded');
      // Perform actions after the page has fully loaded
      setValue("");
    };

    window.addEventListener('load', handleLoad);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);
  // console.log("borders", borders);

  return (
    <>
      <div
        className="square"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          borderTop: `${borders.up}px solid #999`,
          borderBottom: `${borders.down}px solid #999`,
          borderLeft: `${borders.left}px solid #999`,
          borderRight: `${borders.right}px solid #999`,
          fontSize: 8,
        }}
      >
        {/* {borders.inPath ? "X" : ""} */}
        {value}

      </div>
    </>
  );
}

export default function Board() {
  // const ENV = process.env;
  // console.log("env: ", ENV);
  // const [lastSquare, setLastSquare] = useState("null");
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
