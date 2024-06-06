import { example as input } from "../input.js";
import { NodeSet, PathNode, Tile, Vector } from "./lib.js";

const world = input.split("\n").map((line) => line.split("")) as Tile[][];

const goalPos = new Vector(world[0].length - 2, world.length - 1);
console.log(goalPos);

function heuristic(pos: Vector) {
    return Math.abs(pos.x - goalPos.x) + Math.abs(pos.y - goalPos.y);
}

const OPEN = new NodeSet();
const CLOSED = new NodeSet();

const startingNode = new PathNode(
    new Vector(1, 0),
    undefined,
    heuristic,
    world,
);
OPEN.insert(startingNode);

console.log("\n".repeat(world.length));

while (OPEN.size() > 0) {
    const current = OPEN.getWorstNode() as PathNode;
    CLOSED.insert(current);
    // console.log('Current:', current.position);

    if (current.position.equals(goalPos)) {
        console.log("Found:");
        console.log(current.position);
        console.log("gcost / hcost |", current.gcost, "/", current.hcost);
        break;
    }

    for (const neighbor of current.getNeighbors()) {
        if (CLOSED.containsPos(neighbor.position)) {
            const previousNode = CLOSED.getNodeAt(
                neighbor.position,
            ) as PathNode;
            if (
                neighbor.gcost > previousNode.gcost &&
                neighbor.hcost < current.hcost &&
                current.parent !== previousNode
            ) {
                CLOSED.removeNode(neighbor);
                OPEN.insert(neighbor);
                // console.log("replaced node at:", neighbor.position);
            }
        } else {
            OPEN.insert(neighbor);
        }
    }

    draw(current.position);
    await sleep(50);
}

function draw(pos: Vector) {
    const canvas: string[][] = world.map((row) => [...row]);
    for (const closedNode of CLOSED.nodes) {
        const pos = closedNode.position;
        canvas[pos.y][pos.x] = "\x1b[0;31m0\x1b[0m";
    }
    for (const openNode of OPEN.nodes) {
        const pos = openNode.position;
        canvas[pos.y][pos.x] = "\x1b[0;32mo\x1b[0m";
    }
    // console.log('\n');
    console.log(`\x1b[${canvas.length + 2}A`);
    console.log(canvas.map((row) => row.join("")).join("\n"));
    console.log("current pos:", pos);
}

function sleep(millis: number) {
    return new Promise((res) => setTimeout(res, millis));
}
