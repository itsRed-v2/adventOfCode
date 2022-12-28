import { input } from "./input.js";

import { newWorld, newVector, Vector } from "./world.js";
import { newPathNode, PathNode, nodeSet } from "./pathnode.js";

const startDate = Date.now();

const world = newWorld(input);

const start = newVector(1, 0);
const goal = newVector(world.sizeX - 2, world.sizeY - 1);

const finalNode = pathFind(start, goal);
console.log(finalNode.time);

const elapsed = Date.now() - startDate;
console.log("took", elapsed / 1000, "seconds to compute");



function pathFind(start: Vector, goal: Vector): PathNode {
	const OPEN = nodeSet();
	const CLOSED = nodeSet();

	OPEN.add(newPathNode(start, 0, goal));

	let progress = 0;
	while (true) {
		const current = OPEN.extractBestNode();
		CLOSED.add(current);
	
		if (progress++ > 1000) {
			progress = 0;
			console.log("CLOSED", CLOSED.size);
		}
	
		if (current.pos.equals(goal)) {
			return current;
		}
	
		for (const pos of current.getNeighborsPos()) {
			if (world.isOutOfWorld(pos)) continue;
	
			let neighTime = current.time + 1;
			if (!world.isTraversableAt(pos, neighTime)) continue;
			if (OPEN.containsAt(pos, neighTime)) continue;
			if (CLOSED.containsAt(pos, neighTime)) continue;
	
			OPEN.add(newPathNode(pos, neighTime, goal));
		}
	}
}