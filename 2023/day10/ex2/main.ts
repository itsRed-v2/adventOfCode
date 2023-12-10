import { largeExample2 as input } from "../input.js";
import { Vector, getOppositeDirection, allDirections } from "./vector.js";
import { Pipe, NodeSet, CrossNode, pipes } from "./node.js";
import { drawCrossWorld, drawWorld } from "./drawWorld.js";

// You can change these two values to enable/disable an animation of the input being solved
// (only works with the examples, the real input is too big)
const VISUAL = true;
const SLOW = true;

const width = input.indexOf("\n");
const height = input.split("\n").length;
const crossWorldWidth = width + 1;
const crossWorldHeight = height + 1;

console.log("world size:", width, height);
console.log("crossWorld size:", crossWorldWidth, crossWorldHeight);

function getSymbol(pos: Vector) {
    const char = input[pos.y * (width + 1) + pos.x];
    if (char === "\n") return ".";
    return char;
}

function getPipeDirectionsAt(pos: Vector) {
    return pipes[getSymbol(pos)] ?? [];
}

const startIndex = input.indexOf("S");
const startX = startIndex % (width + 1);
const startY = Math.floor(startIndex / (width + 1));
const start = new Vector(startX, startY);

let startPositions: Vector[] = [];
for (const direction of allDirections) {
    const pos = start.add(Vector.fromDirection(direction));
    if (getPipeDirectionsAt(pos).includes(getOppositeDirection(direction))) {
        startPositions.push(pos);
    }
}

// finding Pipes

const openPipes = new NodeSet<Pipe>();
const closedPipes = new NodeSet<Pipe>();

const startPipe = new Pipe(start, 'S');
closedPipes.add(startPipe);
startPositions.forEach(p => openPipes.add(new Pipe(p, getSymbol(p))));

while (!openPipes.isEmpty()) {
    for (const pipe of openPipes.flush()) {
        closedPipes.add(pipe);
        for (const pos of pipe.getNeighborPositions()) {
            if (!closedPipes.containsPos(pos) && !openPipes.containsPos(pos)) {
                openPipes.add(new Pipe(pos, getSymbol(pos)));
            }
        }
    }
    if (VISUAL) {
        drawWorld(width, height, closedPipes);
        if (SLOW) {
            await sleep(50);
        }
    }
}

if (VISUAL) {
    await sleep(2000);
}

// Flood filling the cross space

const closed = new NodeSet<CrossNode>();
const open = new NodeSet<CrossNode>();

open.add(new CrossNode(new Vector(0, 0)));

while (!open.isEmpty()) {
    const currentNode = open.shift();
    if (currentNode === undefined) throw new Error("Cant be undefined here.");
    closed.add(currentNode);
    
    for (let neighbor of currentNode.getNeighbors()) {
        if (!isInCrossWorld(neighbor)) continue;
        if (closed.containsPos(neighbor) || open.containsPos(neighbor)) continue;
        if (!isConnectedInCrossWorld(currentNode.position, neighbor)) continue;

        open.add(new CrossNode(neighbor));
    }

    if (VISUAL) {
        drawCrossWorld(crossWorldHeight, crossWorldWidth, open, closed);
        if (SLOW) {
            await sleep(50);
        }
    }
}

console.log("Found", closed.nodes.length, "cross nodes.");

// Finding the enclosed nodes (they are not surrounded by any cross nodes)

let enclosedNodesCount = 0;
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        let corners = [
            new Vector(x, y),
            new Vector(x + 1, y),
            new Vector(x, y + 1),
            new Vector(x + 1, y + 1)
        ];
        if (!corners.some(vec => closed.containsPos(vec))) {
            enclosedNodesCount++;
        }
    }
}

console.log("Found", enclosedNodesCount, "enclosed tiles.");

// Functions

function isInCrossWorld(pos: Vector) {
    return pos.x < crossWorldWidth
        && pos.x >= 0
        && pos.y < crossWorldHeight
        && pos.y >= 0;
}

function isConnectedInCrossWorld(from: Vector, to: Vector) {
    let difference = to.subtract(from);
    if (difference.equals(Vector.NORTH) || difference.equals(Vector.WEST)) {
        [from, to] = [to, from];
        difference = to.subtract(from);
    }
    if (!difference.equals(Vector.SOUTH) && !difference.equals(Vector.EAST)) {
        throw new Error("Wtf, from and to are not adjacent.");
    }

    if (difference.equals(Vector.EAST)) {
        let topPipe = closedPipes.getNodeAt(from.add(Vector.NORTH));
        let bottomPipe = closedPipes.getNodeAt(from);
        let topPipeOK = topPipe === undefined || !topPipe.directions.includes("south");
        let bottomPipeOK = bottomPipe === undefined || !bottomPipe.directions.includes("north");
        return topPipeOK && bottomPipeOK;
    } else if (difference.equals(Vector.SOUTH)) {
        let leftPipe = closedPipes.getNodeAt(from.add(Vector.WEST));
        let rightPipe = closedPipes.getNodeAt(from);
        let leftPipeOK = leftPipe === undefined || !leftPipe.directions.includes("east");
        let rightPipeOK = rightPipe === undefined || !rightPipe.directions.includes("west");
        return leftPipeOK && rightPipeOK;
    }

    throw new Error("This shouldn't happen, right ?");
}

function sleep(millis: number) {
    return new Promise(resolve => setTimeout(resolve, millis));
}