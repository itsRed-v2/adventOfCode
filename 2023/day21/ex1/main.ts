import { input } from "../input.js";
import { Vector, PathNode, NodeSet } from "./pathfinding.js";

const width = input.indexOf('\n') + 1;

const world = input.split('\n').map(str => str.split(''));

const startIndex = input.indexOf('S');
const startX = startIndex % (width);
const statyY = Math.floor(startIndex / (width));
const startPos = new Vector(startX, statyY);
const startNode = new PathNode(startPos, undefined);

console.log(startPos);

let currentNodes = new NodeSet();
currentNodes.add(startNode);

for (let i = 0; i < 64; i++) {
	let newNodes = new NodeSet();
	for (const node of currentNodes.nodes) {
		for (const neighbor of node.getNeighbors()) {
			if (!isInWorld(neighbor.position)) continue;
			if (isTraversable(neighbor.position)) {
				newNodes.add(neighbor);
			}
		}
	}
	currentNodes = newNodes;
}

console.log(currentNodes.nodes.length);

// functions

function isInWorld(pos: Vector) {
	return pos.y >= 0 && pos.y < world.length && pos.x >= 0 && pos.x < world[pos.y].length;
}

function isTraversable(pos: Vector) {
	const t = tile(pos);
	if (t === undefined) throw new Error("undefined tile at" + pos.x + " " + pos.y);
	return t !== '#';
}

function tile(pos: Vector) {
	if (pos.y < 0 || pos.y >= world.length || pos.x < 0 || pos.x >= world[pos.y].length) throw new Error("index out of bounds");
	return world[pos.y][pos.x];
}