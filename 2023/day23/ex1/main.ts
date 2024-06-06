import { input } from "../input.js";
import { NodeSet, PathNode, Tile, Vector } from "./lib.js";

const world = input.split("\n").map((line) => line.split("")) as Tile[][];

const goalPos = new Vector(world[0].length - 2, world.length - 1);
console.log(goalPos);

function heuristic(pos: Vector) {
    return Math.abs(pos.x - goalPos.x) + Math.abs(pos.y - goalPos.y);
}

let greatestBranchId = 1;
let stuckCounter = 0;

const startingNode = new PathNode(
    new Vector(1, 0),
    undefined,
    heuristic,
    world,
);

console.log("\n".repeat(world.length));

const results = await explore(new NodeSet(), startingNode, greatestBranchId);
console.log("=== DONE ===")
console.log("distances traveled:", results.sort((a, b) => b - a));
console.log("Stuck", stuckCounter, "times.");

async function explore(closed: NodeSet, current: PathNode, branch: number): Promise<number[]> {
    // draw(world, closed, current.position, branch);
    // await sleep(10);

    // const current = open.getWorstNode() as PathNode;
    closed.insert(current);
    // console.log('Current:', current.position);

    if (current.position.equals(goalPos)) {
        return [current.gcost];
    }

    const neighbors = current
        .getNeighbors()
        .filter((node) => !closed.containsPos(node.position));
    if (neighbors.length === 0) {
        stuckCounter++;
        return [];
    }

    let results = await explore(closed.clone(), neighbors.shift() as PathNode, branch);

    for (const n of neighbors) {
        results = results.concat(await explore(closed.clone(), n, ++greatestBranchId));
    }

    return results;
}

function draw(world: Tile[][], closed: NodeSet, currentPos: Vector, branch: number) {
    const canvas: string[][] = world.map((row) => [...row]);

    for (const closedNode of closed.nodes) {
        const pos = closedNode.position;
        canvas[pos.y][pos.x] = "\x1b[0;31m0\x1b[0m";
    }

    canvas[currentPos.y][currentPos.x] = "\x1b[0;32mo\x1b[0m";

    // console.log('\n');
    console.log(`\x1b[${canvas.length + 3}A`);
    console.log(canvas.map((row) => row.join("")).join("\n"));
    console.log("current pos:", currentPos);
    console.log("Branch:", branch);
}

function sleep(millis: number) {
    return new Promise((res) => setTimeout(res, millis));
}
