import { AppData } from "./globals";
import { testMaze12x6, testMaze16x20 } from "./maze-test.js";
import Maze from './maze.js'

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);