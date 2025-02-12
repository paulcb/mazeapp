import { useState } from 'react';
import Maze from './maze.js'

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
  const [maze, mazeBoard] = useState(new Maze(15, 10, 0.5));
  // const ENV = process.env;
  // console.log("secret value test: ", ENV);
  // const edgeRage = 0.5;
  // const rowsLen = 15;
  // const colsLen = 10;
  // const board = [];
  // let graph = new Map();
  // for (let i = 0; i < rowsLen; i++) {
  //   const boardRow = [];
  //   for (let j = 0; j < colsLen; j++) {
  //     const up = Math.random() > edgeRage ? 1 : 0;
  //     const down = Math.random() > edgeRage ? 1 : 0;
  //     const left = Math.random() > edgeRage ? 1 : 0;
  //     const right = Math.random() > edgeRage ? 1 : 0;

  //     const key = `${i} ${j}`;
  //     let nodes = [];
  //     let borders = { up: up, down: down, left: left, right: right, key: key };

  //     if (i - 1 < 0) borders.up = 1;
  //     if (i + 1 >= rowsLen) borders.down = 1;
  //     if (j + 1 >= colsLen) borders.right = 1;
  //     if (j - 1 < 0) borders.left = 1;

  //     if (borders.up == 0) nodes.push(`${i - 1} ${j}`);
  //     if (borders.down == 0) nodes.push(`${i + 1} ${j}`);
  //     if (borders.left == 0) nodes.push(`${i} ${j - 1}`);
  //     if (borders.right == 0) nodes.push(`${i} ${j + 1}`);

  //     graph[key] = nodes;
  //     boardRow.push(borders);
  //     // borders.up = 1;
  //     // borders.down = 1;
  //     // borders.left = 1;
  //     // borders.right = 1;
  //     // console.log(borders);
  //   }

  //   board.push(boardRow);
  // }

  // console.log("graph", graph);

  // const borderCount = (rowsLen * 2) + (colsLen * 2);
  // const start = getRandomInt(0, borderCount - 1);
  // let end = start + (borderCount / 2);
  // if (end > borderCount) end = end - borderCount;
  // console.log("boarderCount", borderCount);
  // console.log("start", start);
  // console.log("end", end);

  return (
    <>
      {board.map((row, i) => (
        <div key={i} className="board-row">
          {row.map(borders => <Square key={borders.key} borders={borders} />)}
        </div>
      ))}
    </>
  );
}
