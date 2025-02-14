import React, { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import Maze from './maze.js'
import { testMaze } from './maze-test.js';

// const UserContext = React.createContext(null);

const maze = new Maze(testMaze);
let squaresq = [];
let path = new Map();
let offPath = false;
let lastSetBlink = null;
let winState = false;
function Square({ borders, mapKey }) {
  // const [value, setValue] = useState("#fff");
  const [color, setColor] = useState(null);
  const [blink, setBlink] = useState("");
  // const { lastSquare, setLastSquare } = useContext(UserContext);
  // const [borders, setborders] = useState(bordersIn);
  function onMouseEnter() {
    if(winState) return;
    if (!maze.graphGroups[0].has(mapKey)) {
      return;
    }

    if (squaresq.length == 0) {
      lastSetBlink = setBlink;
      // setValue('X');
      setColor("#e9cbc5");
      setBlink("blink");
      squaresq.push([mapKey, setColor]);
      return;
    }

    // console.log("onMouseEnter lastSquare", squaresq);
    // console.log("onMouseEnter mapKey", mapKey);
    // console.log("maze.graph", maze.graph);
    const node = maze.graph[squaresq[squaresq.length - 1][0]];
    if (!node.has(mapKey)) {
      offPath = true;
      return;
    }
    offPath = false;
    // setValue('X');
    setColor("#e9cbc5");
    lastSetBlink("");
    setBlink("blink");

    if(mapKey == maze.rPath[3]){
      winState = true;
      console.log("Win!");
      console.log("attr", path);
      for(let attr of path){
        console.log("attr", attr);
        // console.log("path.get(attr)", path.get(attr));
        attr[1][1]("blink");
        attr[1][0]("#a8e4b0");
        lastSetBlink("");
        setColor("#a8e4b0");
        setBlink("blink");
      }
    }

    // if (squaresq.length > 2) {
    //   const temp = squaresq[squaresq.length - 2][0];
    //   if (mapKey === temp) {
    //     console.log("change back", squaresq[1]);
    //     squaresq[squaresq.length - 1][1]("#fff");
    //   }
    // }

  }

  function onMouseLeave() {
    if(winState) return;
    if (offPath) return;

    if (!maze.graphGroups[0].has(mapKey)) {
      return;
    }
    // console.log("onMouseLeave mapKey", mapKey);
    // if (mapKey == lastSquare) {
    //   setColor("#fff");
    // } else {
    //   setColor("#e9cbc5");
    // }
    setColor("#e9cbc5");
    squaresq.push([mapKey, setColor]);
    path.set(mapKey, [setColor, setBlink])
    if (squaresq.length > 10) squaresq.shift();
    lastSetBlink = setBlink;

    // setBlink("");
    offPath = false;
  }

  useEffect(() => {
    // setValue("");
    setColor("#fff");
    // if (borders.inPath) {
    //   setColor("#cff8f8");
    // }

    if (maze.rPath[2] == mapKey) {
      lastSetBlink = setBlink;
      // setValue('X');
      setColor("#e9cbc5");
      setBlink("blink");
      squaresq.push([mapKey, setColor]);
      path.set(mapKey, [setColor, setBlink])
    }

    if (maze.rPath[3] == mapKey) {
      setColor("#e9cbc5");
    }
    const handleLoad = () => {
      console.log('Page has fully loaded');
      // Perform actions after the page has fully loaded
      // setValue("");
    };

    window.addEventListener('load', handleLoad);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <>
      <div
        className={`square ${blink}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          borderTop: `${borders.up}px solid #999`,
          borderBottom: `${borders.down}px solid #999`,
          borderLeft: `${borders.left}px solid #999`,
          borderRight: `${borders.right}px solid #999`,
          fontSize: 8,
          backgroundColor: color
        }}
      >
        {/* {borders.inPath ? "X" : ""} */}
        {/* {value} */}

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
