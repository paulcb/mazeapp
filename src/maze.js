
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
        this.rowsLen = 5;
        this.colsLen = 5;
        this.maxMazeSize = Math.floor((this.colsLen * this.rowsLen) * .68);
        this.board = [];
        this.graph = new Map();
        this.graphGroups = null;
        this.maxPath = null;
        this.debug = true;
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

    // neighbors(node) {
    //     const split = node.split(" ");
    //     const row = Number.parseInt(split[0]);
    //     const col = Number.parseInt(split[1]);
    //     // if (!((row - 1 < 0) || (row + 1 >= this.rowsLen) || (col + 1 >= this.colsLen) || (col - 1 < 0))) continue;

    //     const upKey = `${row - 1} ${col}`;
    //     const downKey = `${row + 1} ${col}`;
    //     const rightKey = `${row} ${col + 1}`;
    //     const leftKey = `${row} ${col - 1}`;
    //     return { up: upKey, down: downKey, right: rightKey, left: leftKey }
    // }

    addAdjacentNode(set, key1, key2) {
        if (set.has(key2)) {
            this.graph[key2].add(key1);
            this.graph[key1].add(key2);
            return true;
        }
        return false;
    }

    buildBoard() {
        if (this.debug) console.log("buildBoard");
        for (let i = 0; i < this.rowsLen; i++) {
            const boardRow = [];
            for (let j = 0; j < this.colsLen; j++) {
                const key = `${i} ${j}`;
                const upKey = `${i - 1} ${j}`;
                const downKey = `${i + 1} ${j}`;
                const rightKey = `${i} ${j + 1}`;
                const leftKey = `${i} ${j - 1}`;

                const inPath = this.maxPath.path.has(key);
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
        if (this.debug) console.log("breadthFirstSearch");
        let visited = new Set();
        let dist = new Map();
        let paths = new Map();
        for (let entry in this.graph) {
            dist[entry] = Infinity;
        }

        dist[source] = 0;
        paths[source] = source;
        let queue = [];
        queue.push(source);
        let found = false;
        while (queue.size != 0 || found) {

            let node = queue.shift();
            if (node == undefined) break;

            visited.add(node);
            for (let n of this.graph[node]) {
                if (!visited.has(n) && dist[node] + 1 < dist[n]) {
                    dist[n] = dist[node] + 1;
                    paths[n] = node;

                    if (dest != null && n == dest) {
                        found = true;
                        break;
                    }

                    queue.push(n);
                }
            }
        }
        let maxPath = null;
        if (findMax) {
            for (let dest in dist) {
                if (dist[dest] == Infinity) continue;
                if (maxPath == null) {
                    maxPath = {
                        path: new Map(), source: source, dest: dest, distance: dist[dest]
                    };
                }

                if (dist[dest] > maxPath.distance) {
                    maxPath = {
                        path: new Map(), source: source, dest: dest, distance: dist[dest]
                    };
                }

            }
        }
        if (found) {
            maxPath = {
                path: new Map(), source: source, dest: dest, distance: dist[dest]
            };
            let p = paths[dest];
            maxPath.path.set(dest, p);
            // console.log("path", p);
            while (p != source) {
                // console.log("path", p);
                let save = p;
                p = paths[p];
                maxPath.path.set(save, p);
            }
        }
        return maxPath;
    }

    findLongestEdgePath() {
        if (this.debug) console.log("findLongestEdgePath");
        let lsp = null;
        for (let entry in this.graph) {
            const split = entry.split(" ");
            const row = Number.parseInt(split[0]);
            const col = Number.parseInt(split[1]);

            if (!((row - 1 < 0) || (row + 1 >= this.rowsLen) || (col + 1 >= this.colsLen) || (col - 1 < 0))) continue;

            const maxPath = this.breadthFirstSearch(entry, null, true);
            if (lsp == null) lsp = maxPath;
            if (lsp.distance < maxPath.distance) {
                lsp = maxPath;
            }
            // console.log("lsp", lsp[0], lsp[1], lsp[2]);
        }
        console.log("lsp", lsp);
        const maxPath = this.breadthFirstSearch(lsp.source, lsp.dest);
        this.maxPath = maxPath;

    }

    findGroups() {
        if (this.debug) console.log("findGroups");
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
        if (this.debug) console.log("generateMaze");
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

        if (this.debug) console.log("connect large groups");
        let largestGroup = graphGroups[0];
        while (largestGroup.size < this.maxMazeSize) {
            let sourceGroup = graphGroups[1];
            if (this.debug) console.log(`connect large groups largestGroup ${sourceGroup.size}`);
            let sourceGroupSize = sourceGroup.size;
            let iteration = 0;
            if (this.debug) console.log(`this.maxMazeSize ${this.maxMazeSize}`);
            if (this.debug) console.log(`connect large groups iteration ${iteration}`);
            if (this.debug) console.log(`sourceGroupSize ${sourceGroupSize}`);
            for (let tempGroup of graphGroups) {
                if (tempGroup === sourceGroup) continue;
                for (const entry of sourceGroup) {
                    const split = entry.split(" ");
                    const row = Number.parseInt(split[0]);
                    const col = Number.parseInt(split[1]);

                    const upKey = `${row - 1} ${col}`;
                    const downKey = `${row + 1} ${col}`;
                    const rightKey = `${row} ${col + 1}`;
                    const leftKey = `${row} ${col - 1}`;

                    if (this.addAdjacentNode(tempGroup, entry, upKey)) {
                        graphGroups = this.findGroups();
                        break;
                    }
                    if (this.addAdjacentNode(tempGroup, entry, downKey)) {
                        graphGroups = this.findGroups();
                        break;
                    }
                    if (this.addAdjacentNode(tempGroup, entry, rightKey)) {
                        graphGroups = this.findGroups();
                        break;
                    }
                    if (this.addAdjacentNode(tempGroup, entry, leftKey)) {
                        graphGroups = this.findGroups();
                        break;
                    }
                }
                largestGroup = graphGroups[0];
                iteration += 1;
            }
        }
        this.graphGroups = graphGroups;
    }

}