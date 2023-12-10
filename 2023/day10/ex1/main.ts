import { input } from "../input.js";
import { Vector, Direction, getOppositeDirection } from "./vector.js";
import { Node, NodeSet } from "./node.js";

const pipes: { [key: string]: Direction[] } = {
    "J": ["north", "west"],
    "L": ["north", "east"],
    "7": ["west", "south"],
    "F": ["east", "south"],
    "-": ["west", "east"],
    "|": ["north", "south"],
    ".": [],
    "S": []
}
const allDirections: Direction[] = ["north", "south", "east", "west"];

const width = input.indexOf("\n");
const startIndex = input.indexOf("S");
const startX = startIndex % (width + 1);
const startY = Math.floor(startIndex / (width + 1));
const start = new Vector(startX, startY);
console.log(start);

let startPositions: Vector[] = [];

for (const direction of allDirections) {
    const pos = start.add(Vector.fromDirection(direction));
    console.log(pos, getSymbol(pos));
    if (getPipeAt(pos).includes(getOppositeDirection(direction))) {
        startPositions.push(pos);
    }
}

// Pathfinding
const startNode = new Node(start, undefined, 'S');
const open = new NodeSet();
const closed = new NodeSet();
startPositions.forEach(p => open.add(new Node(p, startNode, getSymbol(p))));

while (open.nodes.length !== 0) {
    for (const node of open.flush()) {
        closed.add(node);
        for (const pos of node.getNeighborPositions()) {
            if (!closed.containsPos(pos) && !open.containsPos(pos)) open.add(new Node(pos, node, getSymbol(pos)));
        }
    }
}

let closedNodes = closed.flush();
let farthestNode = closedNodes[0];
for (const node of closedNodes) {
    if (node.distance > farthestNode.distance)
        farthestNode = node;
}
console.log(farthestNode.distance);

// Functions

function getSymbol(pos: Vector) {
    const char = input[pos.y * (width + 1) + pos.x];
    if (char === "\n") return ".";
    return char;
}

function getPipeAt(pos: Vector) {
    return pipes[getSymbol(pos)];
}