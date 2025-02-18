import { AppData } from "./globals";
import Maze from './maze.js'

import React, { useEffect, useState } from 'react';
// import { testMaze } from './maze-test.js';
import Board from './Board.js';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

let fetching = false;
let appInit = false;
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reset, setReset] = useState(0);

  const [mazesDates, setMazesDates] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(process.env.PUBLIC_URL + '/mazedata.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };

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

    if (loading && !error) {
      fetchData();
    }

    if (data && !appInit) {
      console.log("f u", data, appInit);
      appInit = true;
      let mazeAdded = false;
      for (let d of data.mazes) {
        console.log("d.date", d.date);
        const date = new Date(d.date);
        mazesDates.push(`${date.toISOString().split('T')[0]}`);
        setMazesDates(mazesDates);
        if (isMobile) {
          if (!mazeAdded) {
            AppData.data.maze = new Maze(d.mobile.data);
            mazeAdded = true;
          }
        } else {
          if (!mazeAdded) {
            AppData.data.maze = new Maze(d.desktop.data);
            mazeAdded = true;
          }
        }
      }
    }

    console.log(loading, error, data, appInit);
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
        <select className="controls" name="mazes" id="maze-select">
          {mazesDates.map((row, i) => (
            <option key={row + " " + i} className="controls" value="">{row}</option>
          ))}
        </select>
      </div>
      <p >(v1.4)</p>
    </>
  );
}
