import { AppData } from "./globals";
import { testMaze12x6, testMaze16x20 } from "./maze-test.js";
import Maze from './maze.js'

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const loadData = true;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile) {
  if (loadData) {
    AppData.data.maze = new Maze(testMaze12x6);
  }
  else {
    AppData.data.maze = new Maze(null, 12, 6);
    AppData.data.maze.init();
  }
} else {
  if (loadData) {
    AppData.data.maze = new Maze(testMaze16x20);
  }
  else {
    AppData.data.maze = new Maze(null, 16, 20);
    AppData.data.maze.init();
  }
}

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);