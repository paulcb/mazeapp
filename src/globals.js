import Maze from "./maze";

export const AppData = {
    data: {

        maze: new Maze(null, 5, 5),
        path: new Map(),
        winState: false,
        lastMapKey: null,
        lastElement: null,
    },
    constants: {
        pathColor: "#e9cbc5",
        winColor: "#a8e4b0",
        blinkClass: "blink"
    }
}
