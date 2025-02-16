import React, { useEffect } from 'react';
import { useState } from 'react';
import Maze from './maze.js'
import { testMaze } from './maze-test.js';

const maze = new Maze(testMaze);
let squaresq = [];
let path = new Map();
let offPath = false;
let lastSetBlink = null;
let winState = false;

const pathColor = "#e9cbc5";
const winColor = "#a8e4b0";
const blinkClass = "blink";

function Square({ borders, mapKey }) {
  const [color, setColor] = useState(null);
  const [blink, setBlink] = useState("");
  function onMouseEnter() {
    if (winState) return;

    if (!maze.graphGroups[0].has(mapKey)) {
      return;
    }

    if (squaresq.length == 0) {
      lastSetBlink = setBlink;
      setColor(pathColor);
      setBlink(blinkClass);
      squaresq.push([mapKey, setColor]);
      return;
    }

    const node = maze.graph[squaresq[squaresq.length - 1][0]];
    if (!node.has(mapKey)) {
      offPath = true;
      return;
    }
    offPath = false;
    setColor(pathColor);
    lastSetBlink("");
    setBlink(blinkClass);

    if (mapKey == maze.rPath[3]) {
      winState = true;
      console.log("Win!");
      console.log("attr", path);
      for (let attr of path) {
        console.log("attr", attr);
        attr[1][1](blinkClass);
        attr[1][0](winColor);
        lastSetBlink("");
        setColor(winColor);
        setBlink(blinkClass);
      }
    }

  }

  function onMouseLeave() {
    if (winState) return;
    if (offPath) return;

    if (!maze.graphGroups[0].has(mapKey)) {
      return;
    }
    setColor(pathColor);
    squaresq.push([mapKey, setColor]);
    path.set(mapKey, [setColor, setBlink]);
    if (squaresq.length > 10) squaresq.shift();
    lastSetBlink = setBlink;

    offPath = false;
  }

  useEffect(() => {
    setColor("#fff");

    if (maze.rPath[2] == mapKey) {
      lastSetBlink = setBlink;
      setColor(pathColor);
      setBlink(blinkClass);
      squaresq.push([mapKey, setColor]);
      path.set(mapKey, [setColor, setBlink])
    }

    if (maze.rPath[3] == mapKey) {
      setColor(pathColor);
    }
  }, []);
  return (
    <>
      <div
        id={`${mapKey}`}
        className={`square ${blink}`}
        // onMouseEnter={onMouseEnter}
        // onMouseLeave={onMouseLeave}
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

let lastMapKey = null;
let lastElement = null;

function squareEvent(element) {
  // console.log("squareEvent", element.id);
  const mapKey = element.id;

  if(mapKey == lastMapKey) return;

  if (winState) return;

  if (!maze.graphGroups[0].has(mapKey)) {
    return;
  }

  if (lastMapKey != null && lastElement != null) {
    console.log("lastMapKey", lastMapKey);
    if (lastMapKey != null) {
      const node = maze.graph[lastMapKey];
      if (!node.has(mapKey)) {
        return;
      }
    }
    lastElement.className = "square";
  }
  element.style.backgroundColor = pathColor;
  element.className = `square ${blinkClass}`;
  path.set(mapKey, element);

  if (mapKey == maze.rPath[3]) {
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

  function onMouseMove(event){
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
      </div>
    </>
  );
}
