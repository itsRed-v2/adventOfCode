import { input } from "./input.mjs";
import Coordinates from "../day9_ex2/coordinates.mjs";
import PathNode from "./pathNode.mjs";
import Status from "./status.mjs";

const TERRAIN = input.split("\n");

const NODES = new Array(TERRAIN.length);
for (let i = 0; i < NODES.length; i++) NODES[i] = new Array(TERRAIN[i].length);

// console.log(TERRAIN);

let found = false;

const start = createNode(0, 0, undefined); // starting node

for (let i = 0; i < 11000 && !found; i++) {
	console.log("Step", i + 1);
	explorePath();
}

renderNodes();

function explorePath() {
	let current;
	for (const node of getOpenNodes()) {
		if (current === undefined) {
			current = node;
			continue;
		}
		if (node.fCost() < current.fCost()) current = node;
		else if (node.fCost() === current.fCost() && node.riskCost < current.riskCost) current = node;
	}
	// console.log("Current node:", current);
	
	current.status = Status.CLOSED;

	if (current.x === TERRAIN.length - 1 && current.y === TERRAIN[0].length - 1) {
		found = true;
		console.log("FOUND | Risk level:", current.riskCost - start.riskCost);
		return;
	}

	let neighbours = getNeighbourCoordinates(current);
	// console.log("neighbours", neighbours);

	for (const coordinate of neighbours) {
		const x = coordinate.x;
		const y = coordinate.y;

		const neighbour = NODES[x][y];
		if (neighbour?.status === Status.CLOSED) continue;
		const recalculatedNeighbour = new PathNode(x, y, current, TERRAIN);

		if (neighbour === undefined) createNode(x, y, current);
		else if (neighbour.fCost() > recalculatedNeighbour.fCost()) createNode(x, y, current);
	}

}

function getNeighbourCoordinates(node) {
	const x = node.x;
	const y = node.y;
	
	const neighbourCoordinates = [];

	if (x > 0)						neighbourCoordinates.push(new Coordinates(x - 1, y));
	if (x < TERRAIN.length - 1)		neighbourCoordinates.push(new Coordinates(x + 1, y));
	if (y > 0)						neighbourCoordinates.push(new Coordinates(x, y - 1));
	if (y < TERRAIN[x].length - 1)	neighbourCoordinates.push(new Coordinates(x, y + 1));

	return neighbourCoordinates;
}

function createNode(x, y, parent) {
	let node = new PathNode(x, y, parent, TERRAIN);
	NODES[x][y] = node;
	return node;
}

function getOpenNodes() {
	let openNodes = [];

	for (const row of NODES) {
		for (const node of row) {
			if (node !== undefined && node.status !== Status.CLOSED) openNodes.push(node);
		}
	}

	return openNodes;
}

function renderNodes() {
	for (const row of NODES) {
		let line = "";
		
		for (const node of row) {
			if (node === undefined) line += ".";
			else if (node.status === Status.OPEN) line += "O";
			else if (node.status === Status.CLOSED) line += "X";
		}

		console.log(line);
	}
}