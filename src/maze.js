
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
        this.edgeRage = 0.5;
        this.rowsLen = 15;
        this.colsLen = 10;
        this.maxMazeSize = this.colsLen * this.rowsLen;
        this.board = [];
        this.graph = new Map();
        this.rPath = null;
        if (!testMaze) {
            this.generateMaze();
        }
        else {
            for (let entry of testMaze) {
                this.graph[entry[0]] = new Set();
                for (let edge of entry[1]) {
                    this.graph[entry[0]].add(edge);
                }
            }

        }
        this.findLongestEdgePath();
        this.buildBoard();
    }

    neighbors(node) {
        const split = node.split(" ");
        const row = Number.parseInt(split[0]);
        const col = Number.parseInt(split[1]);

        const upKey = `${row - 1} ${col}`;
        const downKey = `${row + 1} ${col}`;
        const rightKey = `${row} ${col + 1}`;
        const leftKey = `${row} ${col - 1}`;
        return { up: upKey, down: downKey, right: rightKey, left: leftKey }
    }

    addAdjacentNode(set, key1, key2) {
        if (set.has(key2)) {
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
                // console.log(this.rPath);
                // console.log("key", key, this.rPath[0].has(key));
                const inPath = this.rPath[0].has(key);
                let borders = {
                    up: this.graph[key].has(upKey) ? 0 : 1,
                    down: this.graph[key].has(downKey) ? 0 : 1,
                    left: this.graph[key].has(leftKey) ? 0 : 1,
                    right: this.graph[key].has(rightKey) ? 0 : 1,
                    key: `${i} ${j}`,
                    inPath: inPath
                };
                boardRow.push(borders);
            }
            this.board.push(boardRow);
        }
    }

    breadthFirstSearch(source, dest = null, findMax = false) {
        let s = new Set();
        let dist = new Map();
        let paths = new Map();
        for (let entry in this.graph) {
            dist[entry] = Infinity;
        }

        dist[source] = 0;
        paths[source] = source;
        let q = [];
        q.push(source);
        let found = false;
        while (q.size != 0 || found) {

            let node = q.shift();
            if (node == undefined) break;

            s.add(node);
            for (let n of this.graph[node]) {
                if (!s.has(n) && dist[node] + 1 < dist[n]) {
                    dist[n] = dist[node] + 1;
                    paths[n]=node;

                    if (dest != null && n == dest) {
                        found = true;
                        break;
                    }

                    q.push(n);
                }
            }
        }
        let max = null;
        if (findMax) {
            for (let d in dist) {
                if (dist[d] == Infinity) continue;
                if (max == null) max = [d, dist[d], source];
                if (dist[d] > max[1]) max = [d, dist[d], source];
            }
        }
        let rPath = new Map();
        if (found) {

            let p = paths[dest];
            rPath.set(dest, p);
            // console.log("path", p);
            while (p != source) {
                // console.log("path", p);
                let save = p;
                p = paths[p];
                rPath.set(save, p);
            }
        }

        return [rPath, max]
    }

    findLongestEdgePath() {
        let lsp = null;
        for (let entry in this.graph) {
            const split = entry.split(" ");
            const row = Number.parseInt(split[0]);
            const col = Number.parseInt(split[1]);

            if (!((row - 1 < 0) || (row + 1 >= this.rowsLen) || (col + 1 >= this.colsLen) || (col - 1 < 0))) continue;

            const [rPath_, max] = this.breadthFirstSearch(entry, null, true);
            if (lsp == null) lsp = max;
            if (lsp[1] < max[1]) lsp = max;
        }
        console.log("lsp", lsp);
        const [rPath, max] = this.breadthFirstSearch(lsp[2], lsp[0]);
        this.rPath = [rPath, max];

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
        const maxIteration = graphGroups.size;
        let iteration = 0;
        while (largestGroupSize < this.maxMazeSize || iteration >= maxIteration) {
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

                if (largestGroupSize < this.maxMazeSize) break;

            }
            iteration += 1;
        }
    }

}