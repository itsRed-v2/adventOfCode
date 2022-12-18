import { input } from "../input.js";

import { newVector } from "./vector.js";
import { rockList } from "./rockshape.js";

const MAP_WIDTH = 7;
const ROCK_OBJECTIVE = 1000000000000;

const map = [];

let stoppedRocks = 0;
let currentRock;

let windLoopCount = 0;
let storedTowerHeight;
let storedStoppedRocks;
let towerHeightOffset = 0;

for (let windIndex = 0; stoppedRocks < ROCK_OBJECTIVE; windIndex++) {
	if (currentRock === undefined) {
		currentRock = getCurrentRock();
		currentRock.shift(newVector(2, map.length + 3)); // placing the rock 3 units over the top and 2 units left
	}

	// pushing with air jet
	const wind = getWindByIndex(windIndex);
	const windOffset = (wind === "<" ? -1 : 1);
	const windVector = newVector(windOffset, 0)

	currentRock.shift(windVector);
	if (collides(currentRock)) currentRock.shift(windVector.opposite()); // unshift the rock if it has collided with something

	// falling
	currentRock.shift(newVector(0, -1));
	if (collides(currentRock)) {
		currentRock.shift(newVector(0, 1)) // unshift the rock (place it back to original position)

		for (const p of currentRock.points) { // settling the rock into the map
			addRockAt(p);
		}

		currentRock = undefined;
		stoppedRocks += 1;

		// console.log(`Stopped ${stoppedRocks} rocks`);
	
	}

	// trying to skip thousands of iterations

	if (windIndex % input.length === 0) {
		console.log("REPEAT WIND");
		// console.log("stopped rocks =", stoppedRocks);
		console.log("stopped rocks % 5 =", stoppedRocks % 5);
		// console.log("current rock height", currentRock?.getMin().y);
		// console.log("map height", map.length);
		// console.log("tower height", getTowerHeight());
		console.log("difference:", currentRock?.getMin().y - map.length);
		
		windLoopCount++;

		if (windLoopCount === 3) {
			storedTowerHeight = map.length;
			storedStoppedRocks = stoppedRocks;
		}
		if (windLoopCount === 4) {
			console.log("STARTING REDUCTION")
			let heightGainPerWindLoop = map.length - storedTowerHeight;
			let rockGainPerWindLoop = stoppedRocks - storedStoppedRocks;
			console.log("height gain", heightGainPerWindLoop);
			console.log("rock gain", rockGainPerWindLoop);

			let rocksLeft = ROCK_OBJECTIVE - stoppedRocks;
			let windLoopsToSkip = Math.floor(rocksLeft / rockGainPerWindLoop);
			
			stoppedRocks += rockGainPerWindLoop * windLoopsToSkip;
			towerHeightOffset = heightGainPerWindLoop * windLoopsToSkip;
			console.log("new stopped rocks", stoppedRocks);
			console.log("wind loops skipped:", windLoopsToSkip);
		}
	}

}

console.log("COMPUTATION ENDED")
console.log("tower height", getTowerHeight());

// functions

function getTowerHeight() {
	return map.length + towerHeightOffset;
}

function collides(rock) {
	const min = rock.getMin();
	const max = rock.getMax();

	if (min.y < 0) return true; // floor colliding
	if (min.x < 0) return true; // left edge colliding
	if (max.x >= MAP_WIDTH) return true; // right edge colliding

	// other rock colliding
	for (const point of rock.points) {
		if (isRockAt(point)) return true;
	}

	function isRockAt(vec) {
		if (vec.y >= map.length) return false;
		return map[vec.y][vec.x];
	}
}

function addRockAt(vec) {
	while (map.length <= vec.y) {
		map.push(new Array(MAP_WIDTH).fill(false));
	}

	map[vec.y][vec.x] = true;
}

function getCurrentRock() {
	const rock = rockList[stoppedRocks % rockList.length];
	return rock.clone();
}

function getWindByIndex(i) {
	return input[i % input.length];
}