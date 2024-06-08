import { example as input } from "../input.js";
import { NodeList, PathNode, Tile, Vector } from "./lib.js";

type NodePair = [PathNode, PathNode];

interface TileBridge {
    pos1: Vector,
    pos2: Vector,
    length: number
}

const DEBUG = true;

const world = input.split("\n").map((line) => line.split("")) as Tile[][];
const goalPos = new Vector(world[0].length - 2, world.length - 1);

const bridges = await findBridges();
console.log("Bridges:");
bridges.forEach(bridge => console.log(bridge.pos1, bridge.pos2, "Length", bridge.length));

async function explore(current: Vector, path: TileBridge[], closed: Vector[]) {

}

async function findBridges(): Promise<TileBridge[]> {
    console.log("\n".repeat(world.length));

    const startingNode = new PathNode(new Vector(1, 0), undefined, world);

    const OPEN = new NodeList();
    OPEN.add(startingNode);
    const CLOSED = new NodeList();

    const bridges: NodePair[] = [];

    while (!OPEN.isEmpty()) {
        const current = OPEN.pop() as PathNode;
        CLOSED.add(current);

        if (current.position.equals(goalPos)) {
            await createBridge(current, bridges);
        }

        for (const neighbor of current.getNeighbors()) {
            if (!CLOSED.containsPos(neighbor.position))
                OPEN.add(neighbor);

            if (neighbor.isAtCrossroad()) {
                await createBridge(neighbor, bridges);
            }
        }

        if (DEBUG) {
            draw(world, OPEN, CLOSED);
            await sleep(20);
        }
    }

    drawBridges(world, bridges);
    return bridges.map(nodeBridge => ({
        pos1: nodeBridge[0].position,
        pos2: nodeBridge[1].position,
        length: nodeBridge[0].traceBridge().length
    }));
}

async function createBridge(start: PathNode, bridgeList: NodePair[]) {
    let end = start.getPreviousCrossroad();
    if (end) {
        const bridge: NodePair = [start, end];
        bridgeList.push(bridge);
        if (DEBUG) {
            drawBridges(world, [bridge]);
            await sleep(500);
        }
        return bridge;
    }
}

function draw(world: Tile[][], open: NodeList, closed: NodeList) {
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

function sleep(millis: number) {
    return new Promise(res => setTimeout(res, millis));
}
