import { newVector, Vector } from "./world.js";

export {
	newPathNode,
	PathNode,
	nodeSet
}

interface PathNode {
	pos: Vector,
	time: number
	Hcost: number,
	Fcost: number,
	equals: (node: PathNode) => boolean,
	getNeighborsPos: () => Vector[],
	isBetter: (node: PathNode) => boolean,
	stringify: () => string
}

function newPathNode(pos: Vector, time: number, goal: Vector): PathNode {
	const Hcost = (goal.x - pos.x) + (goal.y - pos.y);
	const Fcost = time + Hcost; // time is our Gcost

	return Object.freeze({
		pos,
		time,
		Hcost,
		Fcost,
		equals,
		getNeighborsPos,
		isBetter,
		stringify
	});

	function equals(node: PathNode) {
		return node.pos.equals(pos) && node.time === time;
	}

	function getNeighborsPos(): Vector[] {
		return [
			newVector(pos.x + 1, pos.y),
			newVector(pos.x - 1, pos.y),
			newVector(pos.x, pos.y + 1),
			newVector(pos.x, pos.y - 1),
			newVector(pos.x, pos.y)
		];
	}

	function isBetter(node: PathNode) {
		if (Fcost < node.Fcost) return true;
		if (Fcost === node.Fcost && Hcost < node.Hcost) return true;
		return false;
	}

	function stringify() {
		return JSON.stringify({
			x: pos.x,
			y: pos.y,
			t: time
		});
	}
}

function nodeSet() {
	const content = new Map<String, PathNode>();

	return Object.freeze({
		content,
		get size() { return content.size},
		add,
		extractBestNode,
		containsAt
	});

	function add(node: PathNode) {
		const key = node.stringify();
		const n = content.get(key);
		if (n && n.isBetter(node)) return;

		content.set(key, node);
	}

	function extractBestNode() {
		let bestNode: PathNode;
		for (const entry of content) {
			const node = entry[1];
			if (!bestNode || node.isBetter(bestNode)) bestNode = node;
		}
		content.delete(bestNode.stringify());
		return bestNode;
	}

	function containsAt(pos: Vector, time: number) {
		let key = JSON.stringify({
			x: pos.x,
			y: pos.y,
			t: time
		});
		return content.has(key);
	}
}