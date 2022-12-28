import { input } from "./input.js";

import { newWorld, newVector, Vector } from "./world.js";
import { nodeSet, newPathNode, PathNode } from "./pathnode.js";

const startDate = Date.now();

const world = newWorld(input);

const start = newVector(1, 0);
const goal = newVector(world.sizeX - 2, world.sizeY - 1);
console.log("phase 1...");
const stop1 = pathFind(start, 0, goal);
console.log("phase 2...");
const stop2 = pathFind(stop1.pos, stop1.time, start);
console.log("phase 3...");
const finalNode = pathFind(stop2.pos, stop2.time, goal);
console.log(finalNode.time);

const elapsed = Date.now() - startDate;
console.log("took", elapsed / 1000, "seconds to compute");



function pathFind(start: Vector, startTime: number, goal: Vector): PathNode {
	const OPEN = nodeSet();
	const CLOSED = nodeSet();

	OPEN.add(newPathNode(start, startTime, goal));

	let progress = 0;
	while (true) {
		const current = OPEN.extractBestNode();
		CLOSED.add(current);

		if (progress++ > 5000) {
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