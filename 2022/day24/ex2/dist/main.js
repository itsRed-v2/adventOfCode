import { input } from "./input.js";
import { newWorld, newVector } from "./world.js";
import { nodeSet, newPathNode } from "./pathnode.js";
console.log("Warning: This code takes very long to complete. (it took about 1h on my pc)");
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
// pathfind function
function pathFind(start, startTime, goal) {
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
            if (world.isOutOfWorld(pos))
                continue;
            let neighTime = current.time + 1;
            if (!world.isTraversableAt(pos, neighTime))
                continue;
            if (OPEN.containsAt(pos, neighTime))
                continue;
            if (CLOSED.containsAt(pos, neighTime))
                continue;
            OPEN.add(newPathNode(pos, neighTime, goal));
        }
    }
}
// objects
// function nodeSet() {
// 	const content: PathNode[] = [];
// 	return Object.freeze({
// 		content,
// 		add,
// 		extractBestNode,
// 		containsAt
// 	});
// 	function add(node: PathNode) {
// 		for (const n of content) {
// 			if (node.equals(n) && n.isBetter(node)) return;
// 		}
// 		content.push(node);
// 	}
// 	function extractBestNode() {
// 		let bestNodeIndex: number = 0;
// 		for (let i = 1; i < content.length; i++) {
// 			if (content[i].isBetter(content[bestNodeIndex])) bestNodeIndex = i;
// 		}
// 		return content.splice(bestNodeIndex, 1)[0];
// 	}
// 	function containsAt(pos: Vector, time: number) {
// 		for (const n of content) {
// 			if (n.pos.equals(pos) && n.time === time) return true;
// 		}
// 		return false;
// 	}
// }
// interface PathNode {
// 	pos: Vector,
// 	time: number
// 	Hcost: number,
// 	Fcost: number,
// 	equals: (node: PathNode) => boolean,
// 	getNeighborsPos: () => Vector[],
// 	isBetter: (node: PathNode) => boolean
// }
// function newPathNode(pos: Vector, time: number, goal: Vector): PathNode {
// 	const Hcost = (goal.x - pos.x) + (goal.y - pos.y);
// 	const Fcost = time + Hcost; // time is our Gcost
// 	return Object.freeze({
// 		pos,
// 		time,
// 		Hcost,
// 		Fcost,
// 		equals,
// 		getNeighborsPos,
// 		isBetter
// 	});
// 	function equals(node: PathNode) {
// 		return node.pos.equals(pos) && node.time === time;
// 	}
// 	function getNeighborsPos(): Vector[] {
// 		return [
// 			newVector(pos.x + 1, pos.y),
// 			newVector(pos.x - 1, pos.y),
// 			newVector(pos.x, pos.y + 1),
// 			newVector(pos.x, pos.y - 1),
// 			newVector(pos.x, pos.y)
// 		];
// 	}
// 	function isBetter(node: PathNode) {
// 		if (Fcost < node.Fcost) return true;
// 		if (Fcost === node.Fcost && Hcost < node.Hcost) return true;
// 		return false;
// 	}
// }
