import { AppData } from "./globals";
import Maze from './maze.js'

import React, { useEffect, useState } from 'react';
// import { testMaze } from './maze-test.js';
import Board from './Board.js';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reset, setReset] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  const [selected, setSelected] = useState(0);
  const [mazesDates, setMazesDates] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(process.env.PUBLIC_URL + '/mazedata.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      let temp = new Map();
      let tempMazesDates = [];
      tempMazesDates.push("Select");
      for (let d of json.mazes) {
        const date = new Date(d.date);
        const dateKey = `${date.toISOString().split('T')[0]}`;
        tempMazesDates.push(dateKey);
        temp.set(dateKey, d);
        setMazesDates(tempMazesDates);
      }
      setData(temp);
    } catch (e) {
      setError(e);
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
      setReset(0);
    }


  }, [reset]);


  useEffect(() => {
    if (loading) {
      const p = fetchData();
    }
  }, [loading]);

  useEffect(() => {
    if (data && loading) {
      let maze = null;
      let date = new Date();
      let dateKey = `${date.toISOString().split('T')[0]}`;

      if (!data.has(dateKey)) {
        date = null;
        for (let [key, value] of data) {
          if (date == null) {
            date = new Date(key);
            dateKey = key;
          }
          const tempDate = new Date(key);
          if (date < tempDate) {
            date = tempDate;
            dateKey = key;
          }
        }
        maze = data.get(dateKey);
      } else {
        maze = data.get(dateKey);
      }

      if (isMobile) {
        AppData.data.maze = new Maze(maze.mobile.data);
      } else {
        AppData.data.maze = new Maze(maze.desktop.data);
      }

      setLoading(false);
    }
  }, [data]);

  function onClick() {
    setReset(1);
  }

  function onChange(event) {
    const maze = data.get(event.target.value);
    AppData.data.winState = false;
    for (let [key, value] of AppData.data.path) {
      value.style.backgroundColor = "#fff";
      value.className = `square`;
    }
    AppData.data.path.clear();
    AppData.data.lastElement = null;
    AppData.data.lastMapKey = null;
    if (isMobile) {
      AppData.data.maze = new Maze(maze.mobile.data);
    } else {
      AppData.data.maze = new Maze(maze.desktop.data);
    }
    setSelected(1);

  }

  useEffect(() => { setSelected(0); }, [selected]);

  if (loading) {
    return (<>Loading...</>);
  }
  return (
    <>
      <Board reset={reset} loading={loading} selected={selected} />
      {/* <Controls></Controls> */}
      <div style={{ float: "left" }}>
        <button className="controls" onClick={onClick}> New </button>
        <select className="controls" name="mazes" id="maze-select" onChange={onChange} value={selectedValue} >
          {mazesDates.map((row, i) => (
            <option key={row + " " + i} className="controls" value={row}>{row}</option>

          ))}
        </select>
      </div>
      <p >(v1.4)</p>
    </>
  );

}
