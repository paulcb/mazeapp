
// class Boarders {
//     up: number;
//     down: number;
//     left: number;
//     right: number;
//     key: null;
//     constructor(up = 0, down = 0, left = 0, right = 0, key = null) {
//         this.up = up;
//         this.down = down;
//         this.left = left;
//         this.right = right;
//         this.key = key;
//     }
// }

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function compareNumbers(a: Set<string>, b: Set<string>) {
    return a.size - b.size;
}

export default class Maze {
    board: any[];
    graph: Map<any, any>;
    graphGroups: Set<string>[] | null;
    maxPath: null;
    debug: boolean;
    groupRate: number;
    inputMaze: any;
    rowsLen: any;
    colsLen: any;
    maxMazeSize: number;
    edgeRate: number;
    edgeRate2: number;
    mazeJsonOutput: any;
    constructor(inputMaze: any, rowsLen = 16, colsLen = 6, edgeRate = .5, groupRate = .68, isInit = false, debug = false) {
        this.board = [];
        this.graph = new Map();
        this.graphGroups = null;
        this.maxPath = null;
        this.debug = debug;
        this.groupRate = groupRate;

        this.inputMaze = inputMaze;
        if (inputMaze) {
            this.rowsLen = inputMaze.dims.rowsLen;
            this.colsLen = inputMaze.dims.colsLen;
            this.maxMazeSize = Math.floor((this.colsLen * this.rowsLen) * this.groupRate);
            this.init();
            return;
        }
        this.edgeRate = edgeRate;
        this.rowsLen = rowsLen;
        this.colsLen = colsLen;

        this.maxMazeSize = Math.floor((this.colsLen * this.rowsLen) * this.groupRate);

        if (isInit) {
            this.init();
        }
    }

    init() {
        if (!this.inputMaze) {
            this.generateMaze();
        }
        else {

            for (let entry of this.inputMaze.nodes) {
                this.graph.set(entry[0], new Set<string>());
                for (let edge of entry[1]) {
                    this.graph.get(entry[0]).add(edge);
                }
            }
            this.findGroups();
            let graphGroups = this.findGroups();
            this.graphGroups = graphGroups;

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

    addAdjacentNode(set: Set<string>, key1: string, key2: string) {
        if (set.has(key2)) {
            this.graph.get(key2).add(key1);
            this.graph.get(key1).add(key2);
            return true;
        }
        return false;
    }

    buildBoard() {
        if (this.debug) console.log("buildBoard");
        for (let i = 0; i < this.rowsLen; i++) {
            const boardRow: any[] = [];
            for (let j = 0; j < this.colsLen; j++) {
                const key = `${i} ${j}`;
                const upKey = `${i - 1} ${j}`;
                const downKey = `${i + 1} ${j}`;
                const rightKey = `${i} ${j + 1}`;
                const leftKey = `${i} ${j - 1}`;

                const inPath = this.maxPath.path.has(key);
                let borders = {
                    up: this.graph.get(key).has(upKey) ? 0 : 1,
                    down: this.graph.get(key).has(downKey) ? 0 : 1,
                    left: this.graph.get(key).has(leftKey) ? 0 : 1,
                    right: this.graph.get(key).has(rightKey) ? 0 : 1,
                    key: `${i} ${j}`,
                    inPath: inPath
                };
                boardRow.push(borders);
            }
            this.board.push(boardRow);
        }
    }

    breadthFirstSearch(source: string, dest: string | null = null, findMax = false) {
        if (this.debug) console.log("breadthFirstSearch");
        let visited = new Set();
        let dist = new Map();
        let paths = new Map();
        for (let entry in this.graph) {
            dist.set(entry, Infinity);
        }

        dist.set(source, 0);
        paths.set(source, source);
        let queue: any[] = [];
        queue.push(source);
        let found = false;
        while (queue.length != 0 || found) {

            let node = queue.shift();
            if (node == undefined) break;

            visited.add(node);
            for (let n of this.graph.get(node)) {
                if (!visited.has(n) && dist.get(node) + 1 < dist.get(n)) {
                    dist.set(n, dist.get(node) + 1);
                    paths.set(n, node);

                    if (dest != null && n == dest) {
                        found = true;
                        break;
                    }

                    queue.push(n);
                }
            }
        }
        let maxPath: any = null;
        if (findMax) {
            for (let dest_i in dist) {

                if (dist.get(dest_i) == Infinity) continue;
                if (maxPath == null) {
                    maxPath = {
                        path: new Map(), source: source, dest: dest_i, distance: dist.get(dest_i)
                    };
                }

                if (dist.get(dest_i) > maxPath.distance) {
                    maxPath = {
                        path: new Map(), source: source, dest: dest_i, distance: dist.get(dest_i)
                    };
                }

            }
        }
        if (dest != null && found) {
            maxPath = {
                path: new Map(), source: source, dest: dest, distance: dist.get(dest)
            };
            let p = paths.get(dest);
            maxPath.path.set(dest, p);
            // console.log("path", p);
            while (p != source) {
                // console.log("path", p);
                let save = p;
                p = paths.get(p);
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
        }
        if (lsp == null) {
            console.log("lsp is null!");
            return;
        }
        const maxPath = this.breadthFirstSearch(lsp.source, lsp.dest);
        this.maxPath = maxPath;

    }

    findGroups() {
        if (this.debug) console.log("findGroups");
        let graphGroups: Set<string>[] = [];
        let globalVisited = new Set<string>();
        for (let key in this.graph) {
            if (globalVisited.has(key)) continue;
            let visited = new Set<string>();
            let stack: string[] = [key];
            while (stack.length != 0) {
                const node = stack.pop();
                if (node === undefined) break;
                if (!visited.has(node)) {
                    visited.add(node);
                    globalVisited.add(node);
                    const nodes = this.graph.get(node);
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
                    up: Math.random() > this.edgeRate ? 1 : 0,
                    down: Math.random() > this.edgeRate ? 1 : 0,
                    left: Math.random() > this.edgeRate ? 1 : 0,
                    right: Math.random() > this.edgeRate ? 1 : 0,
                    key: key
                };

                if (i - 1 < 0) {
                    borders.up = 1;
                } else {
                    if (borders.up == 1 && this.graph.get(upKey).has(key)) {
                        this.graph.get(upKey).delete(key);
                    }

                    if (borders.up == 0 && !this.graph.get(upKey).has(key)) {
                        this.graph.get(upKey).add(key);
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
                    if (borders.left == 1 && this.graph.get(leftKey).has(key)) {
                        this.graph.get(leftKey).delete(key);
                    }

                    if (borders.left == 0 && !this.graph.get(leftKey).has(key)) {
                        this.graph.get(leftKey).add(key);
                    }
                }


                if (borders.up == 0) nodes.add(upKey);
                if (borders.down == 0) nodes.add(downKey);
                if (borders.right == 0) nodes.add(rightKey);
                if (borders.left == 0) nodes.add(leftKey);


                this.graph.set(key, nodes);
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
        const mazeData = { data: { dims: { rowsLen: this.rowsLen, colsLen: this.colsLen }, nodes: null } };
        const nodes: any[] = [];
        for (let key in this.graph) {
            nodes.push([key, [...this.graph.get(key).values()]]);

        }
        mazeData.data.nodes = nodes;
        this.mazeJsonOutput = mazeData;
    }

}