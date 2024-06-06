import { example, input as realInput } from "../input.js";
import { NodeList, PathNode, Tile, Vector } from "./lib.js";

const DEBUG = false;

const input = DEBUG ? example : realInput;
const world = input.split("\n").map((line) => line.split("")) as Tile[][];
const goalPos = new Vector(world[0].length - 2, world.length - 1);

if (DEBUG) {
    console.log("\n".repeat(world.length));
}

function heuristic(pos: Vector) {
    // Manhattan distance
    return Math.abs(pos.x - goalPos.x) + Math.abs(pos.y - goalPos.y);
}

const startingNode = new PathNode(new Vector(1, 0), undefined, heuristic, world);

const results = await explore(new NodeList(), startingNode);
results.sort((a, b) => b - a);

console.log("RESULTS:")
console.log("Distances traveled:", results);
console.log("Longest path length:", results[0]);

async function explore(closed: NodeList, current: PathNode): Promise<number[]> {
    if (DEBUG) {
        draw(world, closed, current.position);
        await sleep(20);
    }

    closed.add(current);

    if (current.position.equals(goalPos)) {
        return [current.gcost];
    }

    const neighbors = current
        .getNeighbors()
        .filter(node => !closed.containsPos(node.position));

    let results: number[] = [];
    for (const n of neighbors) {
        results = results.concat(await explore(closed.clone(), n));
    }
    return results;
}

function draw(world: Tile[][], closed: NodeList, currentPos: Vector) {
    const canvas: string[][] = world.map((row) => [...row]);

    for (const closedNode of closed.nodes) {
        const pos = closedNode.position;
        canvas[pos.y][pos.x] = "\x1b[0;31mo\x1b[0m";
    }

    canvas[currentPos.y][currentPos.x] = "\x1b[0;32m0\x1b[0m";

    console.log(`\x1b[${canvas.length + 2}A`);
    console.log(canvas.map((row) => row.join("")).join("\n"));
    console.log("current pos:", currentPos);
}

function sleep(millis: number) {
    return new Promise(res => setTimeout(res, millis));
}
