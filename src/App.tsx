import { AppData } from "./globals";

import React, { ChangeEvent, useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import Board from './Board';
import Maze from './maze'

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function App() {
  const [data, setData] = useState<Map<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [reset, setReset] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [mazesDates, setMazesDates] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(process.env.PUBLIC_URL + '/mazedata.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      const temp = new Map();
      const tempMazesDates: string[] = [];
      tempMazesDates.push("Select");
      for (const d of json.mazes) {
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
      for (const [, value] of AppData.data.path) {
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
      let date: Date | null = new Date();
      let dateKey = `${date.toISOString().split('T')[0]}`;

      if (!data.has(dateKey)) {
        date = null;
        for (const [key] of data) {
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
  }, [data, loading]);

  function onClick() {
    setReset(1);
  }

  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    if (event == null) return;
    setSelected(event.target.value);
  }

  useEffect(() => {
    if (selected == null || data == null) return;

    const maze = data.get(selected);
    AppData.data.winState = false;
    for (const [, value] of AppData.data.path) {
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
    setSelected(null);
  }, [selected, data]);

  if (loading) {
    return (<>Loading...</>);
  }
  return (
    <>
      <Board />
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

export default App;
