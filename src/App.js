import { AppData } from "./globals";
import Maze from './maze.js'

import React, { useEffect, useState } from 'react';
// import { testMaze } from './maze-test.js';
import Board from './Board.js';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export default function App() {

  const [reset, setReset] = useState(0);

  useEffect(() => {
    if (reset) {
      AppData.data.winState = false;
      for (let [key, value] of AppData.data.path) {
        value.style.backgroundColor = "#fff";
        value.className = `square`;
      }
      AppData.data.path.clear();
      AppData.data.lastElement = null;
      AppData.data.lastMapKey = null;
      if (isMobile) {
        AppData.data.maze = new Maze(null, 12, 6);
        AppData.data.maze.init();
      } else {
        AppData.data.maze = new Maze(null, 16, 20);
        AppData.data.maze.init();
      }

    }
    setReset(0);
  });

  function onClick() {
    setReset(1);
  }

  return (
    <>
      <Board reset={reset} />
      {/* <Controls></Controls> */}
      <div style={{ float: "left" }}>
        <button className="controls" onClick={onClick}> New </button>
        <p className="controls">(v1.4)</p>
      </div>
    </>
  );
}
