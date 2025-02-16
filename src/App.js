import React, { useEffect } from 'react';
import { useState } from 'react';
import Maze from './maze.js'
import { testMaze } from './maze-test.js';

const maze = new Maze(testMaze);
let path = new Map();
let winState = false;
const pathColor = "#e9cbc5";
const winColor = "#a8e4b0";
const blinkClass = "blink";

let lastMapKey = null;
let lastElement = null;

function Square({ borders, mapKey }) {
  const [color, setColor] = useState(null);
  const [blink, setBlink] = useState("");

  useEffect(() => {
    setColor("#fff");

    if (maze.maxPath.source == mapKey && !winState) {
      setColor(pathColor);
      setBlink(blinkClass);
    }

    if (maze.maxPath.dest == mapKey && !winState) {
      setColor(pathColor);
    }

  }, []);
  return (
    <>
      <div
        id={`${mapKey}`}
        className={`square ${blink}`}
        style={{
          borderTop: `${borders.up}px solid #999`,
          borderBottom: `${borders.down}px solid #999`,
          borderLeft: `${borders.left}px solid #999`,
          borderRight: `${borders.right}px solid #999`,
          fontSize: 8,
          backgroundColor: color,
          touchAction: 'none',

        }}
      >
      </div>
    </>
  );
}

function squareEvent(element) {
  if (lastMapKey == null) {
    if(element.id != maze.maxPath.source) return;
    lastMapKey = element.id;
    lastElement = element;
    path.set(lastMapKey, lastElement);
    return;
  }
  const mapKey = element.id;

  if (mapKey == lastMapKey) return;

  if (winState) return;

  if (!maze.graphGroups[0].has(mapKey)) {
    return;
  }

  if (lastMapKey != null) {
    const node = maze.graph[lastMapKey];
    if (!node.has(mapKey)) {
      return;
    }
  }

  lastElement.className = "square";

  element.style.backgroundColor = pathColor;
  element.className = `square ${blinkClass}`;
  path.set(mapKey, element);

  if (mapKey == maze.maxPath.dest) {
    winState = true;
    console.log("Win!");
    for (let [key, value] of path) {
      value.style.backgroundColor = winColor;
      value.className = `square ${blinkClass}`;
    }
  }

  lastMapKey = element.id;
  lastElement = element;
}

export default function Board() {

  function onTouchStart(event) { console.log("onTouchStart", event.touches); }

  function onTouchMove(event) {
    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;
    const element = document.elementFromPoint(x, y);
    if (element == null) return;
    if (element.className.slice(0, 6) != 'square') return;
    squareEvent(element);
  }

  function onMouseMove(event) {
    if (event.target.className.slice(0, 6) != 'square') return;
    squareEvent(event.target);
  }

  function onTouchEnd(event) { console.log("onTouchEnd", event.touches); }

  return (
    <>
      <div style={{ touchAction: 'none', position: 'fixed' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseMove={onMouseMove}
      >
        {maze.board.map((row, i) => (
          <div key={i} className="board-row">
            {row.map((borders, j) => <Square key={borders.key} borders={borders} mapKey={`${i} ${j}`} />)}
          </div>
        ))}
        a maze game (v1.2)
      </div>
    </>
  );
}
