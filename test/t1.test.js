import fs from "node:fs";

import Maze from "../src/maze.js";

const maze1 = new Maze(null, 12, 6);
maze1.init();

const maze2 = new Maze(null, 16, 20);
maze2.init();


const maze3 = new Maze(null, 12, 6);
maze3.init();

const maze4 = new Maze(null, 16, 20);
maze4.init();


const yesterday = new Date("2025-2-17");
const today = new Date("2025-2-18");

const res = {
    mazes: [
        { date: today, mobile: maze1.mazeJsonOutput, desktop: maze2.mazeJsonOutput },
        { date: yesterday, mobile: maze3.mazeJsonOutput, desktop: maze4.mazeJsonOutput }
    ]
};

console.log(res);

fs.writeFile('test/mazedata.json', JSON.stringify(res), err => {
    if (err) {
        console.error(err);
    } else {
        // file written successfully
    }
});