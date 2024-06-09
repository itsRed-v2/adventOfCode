import { Edge } from "./graphSolver.js";
import { PathNode, Tile, Vector, NodeList, NodePair, sleep, Line } from "./lib.js";

async function findEdges(DEBUG: boolean, world: Tile[][]): Promise<Edge[]> {
    console.log("\n".repeat(world.length));

    const startingNode = new PathNode(new Vector(1, 0), undefined, world);
    const goalPos = new Vector(world[0].length - 2, world.length - 1);

    const OPEN = new NodeList();
    OPEN.add(startingNode);
    const CLOSED = new NodeList();

    const bridges: NodePair[] = [];

    while (!OPEN.isEmpty()) {
        const current = OPEN.pop() as PathNode;
        CLOSED.add(current);

        if (current.position.equals(goalPos)) {
            await createBridge(current);
        }

        for (const neighbor of current.getNeighbors()) {
            if (!CLOSED.containsPos(neighbor.position))
                OPEN.add(neighbor);

            if (neighbor.isAtCrossroad()) {
                await createBridge(neighbor);
            }
        }

        if (DEBUG) {
            drawPathfinding(world, OPEN, CLOSED);
            await sleep(20);
        }
    }

    const lines = bridges.map(pair => [pair[0].position, pair[1].position] as Line)
    drawLines(world, lines);

    return bridges.map(bridge => ({
        pos1: bridge[0].position,
        pos2: bridge[1].position,
        length: bridge[0].traceBridge().length + 1
    }));

    // createBridge helper

    async function createBridge(start: PathNode) {
        let end = start.getPreviousCrossroad();
        if (end) {
            const bridge: NodePair = [start, end];
            bridges.push(bridge);

            if (DEBUG) {
                drawBridges(world, [bridge]);
                console.log("\x07\x1b[1A"); // Bell
                await sleep(500);
            }
        }
    }
}

function drawPathfinding(world: Tile[][], open: NodeList, closed: NodeList) {
    const canvas: string[][] = world.map((row) => [...row]);

    for (const closedNode of closed.getNodes()) {
        const pos = closedNode.position;
        canvas[pos.y][pos.x] = "\x1b[0;31mo\x1b[0m";
    }

    for (const openNode of open.getNodes()) {
        const pos = openNode.position;
        canvas[pos.y][pos.x] = "\x1b[0;32m0\x1b[0m";
    }

    console.log(`\x1b[${canvas.length + 1}A`);
    console.log(canvas.map((row) => row.join("")).join("\n"));
}

function drawBridges(world: Tile[][], bridges: NodePair[]) {
    const canvas: string[][] = world.map((row) => [...row]);

    for (const [start, _end] of bridges) {
        for (const pos of start.traceBridge()) {
            canvas[pos.y][pos.x] = "\x1b[0;33mo\x1b[0m";
        }
    }

    for (const [start, end] of bridges) {
        canvas[start.position.y][start.position.x] = "\x1b[0;31m0\x1b[0m";
        canvas[end.position.y][end.position.x] = "\x1b[0;31m0\x1b[0m";
    }

    console.log(`\x1b[${canvas.length + 1}A`);
    console.log(canvas.map((row) => row.join("")).join("\n"));
}

function drawLines(world: Tile[][], lines: Line[]) {
    const canvas: string[][] = world.map((row) => [...row]);

    for (const [start, end] of lines) {
        line(start, end);
    }

    for (const [start, end] of lines) {
        canvas[start.y][start.x] = "\x1b[0;32m0\x1b[0m";
        canvas[end.y][end.x] = "\x1b[0;32m0\x1b[0m";
    }

    console.log(`\x1b[${canvas.length + 1}A`);
    console.log(canvas.map((row) => row.join("")).join("\n"));

    function line(start: Vector, end: Vector) {
        for (let t = 0; t < 1.0; t+=0.01) {
            let x = Math.round(start.x * t + end.x * (1 - t));
            let y = Math.round(start.y * t + end.y * (1 - t));
            canvas[y][x] = "\x1b[0;31m*\x1b[0m";
        }
    }
}

export {
    findEdges,
    drawLines
}
