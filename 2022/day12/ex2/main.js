import { input } from "../input.js";

const HEIGHTS = "abcdefghijklmnopqrstuvwxyz";

const heightMap = input.replace("S", "a").replace("E", "z").split("\n");

let lenX = heightMap[0].length;
let lenY = heightMap.length;

let startPoint;

const map = input.split("\n").map(line => line.split(""));

for (let x = 0; x < lenX; x++) {
	for (let y = 0; y < lenY; y++) {
		let char = map[y][x];
		if (char === "E") startPoint = newVec(x, y);
	}
}

console.log("Shortest path length:", (await pathFind()).Gcost);

async function pathFind() {
	const OPEN = nodeSet();
	const CLOSED = nodeSet();

	OPEN.add(newPathNode(startPoint, undefined));

	while (true) {
		let current = OPEN.extractBestNode();
		CLOSED.add(current);

		if (current.getHeight() === 0) {
			return current;
		}

		for (const n of current.getAccessibleNeighbours()) {
			if (CLOSED.containsNode(n)) continue;
			OPEN.add(n);
		}
	}
}

// objects

function newVec(x, y) {
	return Object.freeze({
		x,
		y,
		distance,
		equals,
		add,
		isValidPos
	});

	function isValidPos() {
		return x >= 0 && x < lenX && y >= 0 && y < lenY;
	}

	function equals(otherVec) {
		return x === otherVec.x && y === otherVec.y;
	}

	function distance(otherVec) {
		const deltaX = otherVec.x - x;
		const deltaY = otherVec.y - y;
		return Math.sqrt(deltaX ** 2 + deltaY ** 2)
	}

	function add(x2, y2) {
		return newVec(x + x2, y + y2);
	}
}

function newPathNode(pos, parent) {
	let Gcost = 0;
	if (parent) Gcost = parent.Gcost + 1;

	const THIS = Object.freeze({
		pos,
		parent,
		Gcost,
		getAccessibleNeighbours,
		getHeight
	});
	return THIS;

	function getAccessibleNeighbours() {
		let neighbours = [
			newPathNode(pos.add(0, 1), THIS),
			newPathNode(pos.add(0, -1), THIS),
			newPathNode(pos.add(1, 0), THIS),
			newPathNode(pos.add(-1, 0), THIS),
		];

		const minHeight = getHeight() - 1;
		return neighbours.filter(n => n.pos.isValidPos() && n.getHeight() >= minHeight);
	}

	function getHeight() {
		const char = heightMap[pos.y][pos.x];
		return HEIGHTS.indexOf(char);
	}
}

function nodeSet() {
	let content = [];

	return Object.freeze({
		get size() { return content.length; },
		add,
		extractBestNode,
		containsNode,
		containsPos
	});

	function add(node) {
		for (let i = 0; i < content.length; i++) {
			const n = content[i];
			if (node.pos.equals(n.pos)) {
				if (node.Gcost < n.Gcost ) {
					content[i] = node;
				}
				return;
			}
		}
		content.push(node);
	}

	function extractBestNode() {
		let bestNode;
		let bestNodeIndex;
		for (let i = 0; i < content.length; i++) {
			const node = content[i];
			if (bestNodeIndex == undefined
					|| node.Gcost < bestNode.Gcost)
			{
				bestNode = node;
				bestNodeIndex = i;
			}
		}
		return content.splice(bestNodeIndex, 1)[0];
	}

	function containsNode(node) {
		for (const n of content) {
			if (n.pos.equals(node.pos)) return true
		}
		return false;
	}

	function containsPos(pos) {
		for (const node of content) {
			if (node.pos.equals(pos)) return true
		}
		return false;
	}
}