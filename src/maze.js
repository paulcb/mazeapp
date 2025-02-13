
class Boarders {
    constructor(up = 0, down = 0, left = 0, right = 0, key = null) {
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
        this.key = key;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function compareNumbers(a, b) {
    return a.size - b.size;
}

export default class Maze {
    constructor(testMaze) {
        this.edgeRage = 0.55;
        this.rowsLen = 15;
        this.colsLen = 10;
        this.board = [];
        this.graph = new Map();
        if (!testMaze) {
            this.generateMaze();
            this.buildBoard();
        }
        else {
            // this.graph = new Map(Object.entries(JSON.parse(testMaze)));
            for (let entry of testMaze) {
                this.graph[entry[0]] = new Set();
                for (let edge of entry[1]) {
                    this.graph[entry[0]].add(edge);
                }
            }
            this.buildBoard();

        }
    }

    addAdjacentNode(set, key1, key2) {
        // console.log(set);
        // console.log(`key1 ${key1} key2 ${key2}`);
        if (set.has(key2)) {
            // console.log(set);
            // console.log(`key1 ${key1} key2 ${key2}`);
            // console.log(this.graph[key2]);
            // console.log(this.graph[key1]);
            this.graph[key2].add(key1);
            this.graph[key1].add(key2);

            return true;
        }

        return false;
    }

    buildBoard() {
        for (let i = 0; i < this.rowsLen; i++) {
            const boardRow = [];
            for (let j = 0; j < this.colsLen; j++) {
                const key = `${i} ${j}`;
                const upKey = `${i - 1} ${j}`;
                const downKey = `${i + 1} ${j}`;
                const rightKey = `${i} ${j + 1}`;
                const leftKey = `${i} ${j - 1}`;
                let borders = {
                    up: this.graph[key].has(upKey) ? 0 : 1,
                    down: this.graph[key].has(downKey) ? 0 : 1,
                    left: this.graph[key].has(leftKey) ? 0 : 1,
                    right: this.graph[key].has(rightKey) ? 0 : 1,
                    key: `${i} ${j}`
                };
                boardRow.push(borders);
            }
            this.board.push(boardRow);
        }
    }

    findGroups() {
        let graphGroups = [];
        let globalVisited = new Set();
        for (let key in this.graph) {
            if (globalVisited.has(key)) continue;
            let visited = new Set();
            let stack = [key];
            while (stack.length != 0) {
                const node = stack.pop();
                if (!visited.has(node)) {
                    visited.add(node);
                    globalVisited.add(node);
                    const nodes = this.graph[node];
                    for (const entry of nodes) {
                        if (!visited.has(entry)) {
                            stack.push(entry);
                        }
                    }
                }
            }
            graphGroups.push(visited);
        }
        graphGroups.sort(compareNumbers).reverse();
        return graphGroups;
    }

    generateMaze() {

        for (let i = 0; i < this.rowsLen; i++) {
            const boardRow = [];
            for (let j = 0; j < this.colsLen; j++) {
                const key = `${i} ${j}`;
                const upKey = `${i - 1} ${j}`;
                const downKey = `${i + 1} ${j}`;
                const rightKey = `${i} ${j + 1}`;
                const leftKey = `${i} ${j - 1}`;

                let nodes = new Set();
                let borders = {
                    up: Math.random() > this.edgeRage ? 1 : 0,
                    down: Math.random() > this.edgeRage ? 1 : 0,
                    left: Math.random() > this.edgeRage ? 1 : 0,
                    right: Math.random() > this.edgeRage ? 1 : 0,
                    key: key
                };

                if (i - 1 < 0) {
                    borders.up = 1;
                } else {
                    if (borders.up == 1 && this.graph[upKey].has(key)) {
                        this.graph[upKey].delete(key);
                    }

                    if (borders.up == 0 && !this.graph[upKey].has(key)) {
                        this.graph[upKey].add(key);
                    }
                }

                if (i + 1 >= this.rowsLen) {
                    borders.down = 1;
                }

                if (j + 1 >= this.colsLen) {
                    borders.right = 1;
                }

                if (j - 1 < 0) {
                    borders.left = 1;
                } else {
                    if (borders.left == 1 && this.graph[leftKey].has(key)) {
                        this.graph[leftKey].delete(key);
                    }

                    if (borders.left == 0 && !this.graph[leftKey].has(key)) {
                        this.graph[leftKey].add(key);
                    }
                }


                if (borders.up == 0) nodes.add(upKey);
                if (borders.down == 0) nodes.add(downKey);
                if (borders.right == 0) nodes.add(rightKey);
                if (borders.left == 0) nodes.add(leftKey);


                this.graph[key] = nodes;
            }
        }
        let graphGroups = this.findGroups();
        let largestGroup = graphGroups.shift();
        let largestGroupSize = largestGroup.size;
        const maxMazeSize = (this.rowsLen * this.colsLen);
        const maxIteration = graphGroups.size;
        let iteration = 0;
        while (largestGroupSize < maxMazeSize || iteration >= maxIteration) {
            for (let set of graphGroups) {
                for (const entry of largestGroup) {
                    const split = entry.split(" ");
                    const row = Number.parseInt(split[0]);
                    const col = Number.parseInt(split[1]);

                    const upKey = `${row - 1} ${col}`;
                    const downKey = `${row + 1} ${col}`;
                    const rightKey = `${row} ${col + 1}`;
                    const leftKey = `${row} ${col - 1}`;

                    if (this.addAdjacentNode(set, entry, upKey)) {
                        largestGroupSize += set.size;
                        break;
                    }
                    if (this.addAdjacentNode(set, entry, downKey)) {
                        largestGroupSize += set.size;
                        break;
                    }
                    if (this.addAdjacentNode(set, entry, rightKey)) {
                        largestGroupSize += set.size;
                        break;
                    }
                    if (this.addAdjacentNode(set, entry, leftKey)) {
                        largestGroupSize += set.size;
                        break;
                    }
                }

                if (largestGroupSize < maxMazeSize) break;

            }
            iteration += 1;
        }
        
        // graphGroups.sort(compareNumbers).reverse();
        // console.log("graphGroups", graphGroups);
        // console.log(this.graph);
        // console.log(JSON.stringify(this.graph));

        // let outputMaze=[];
        // for (let entry in this.graph) {

        //     const edges = [...this.graph[entry]];
        //     outputMaze.push([entry, edges]);
        // }
        // console.log(JSON.stringify(outputMaze));
    }

    // const borderCount = (this.rowsLen * 2) + (this.colsLen * 2);
    // const start = getRandomInt(0, borderCount - 1);
    // let end = start + (borderCount / 2);
    // if (end > borderCount) end = end - borderCount;
    // console.log("boarderCount", borderCount);
    // console.log("start", start);
    // console.log("end", end);

    // let dist = new Array(maxMazeSize);
    // let sptSet = new Array(maxMazeSize);

    // // Initialize all distances as 
    // // INFINITE and stpSet[] as false 
    // for (let i = 0; i < maxMazeSize; i++) {
    //     dist[i] = Number.MAX_VALUE;
    //     sptSet[i] = false;
    // }

    // // Distance of source vertex 
    // // from itself is always 0 
    // dist[0] = 0;

    // console.log(dist);
    // console.log(sptSet);
}