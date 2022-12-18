import { input } from "../input.js";

import { newVector, newMutableVector } from "../vector.js";
import { VectorSet } from "./vectorSet.js";

let startTime = new Date();

const cubes = input.split("\n").map(line => line.split(",").map(strNb => parseInt(strNb))).map(arr => newVector(arr[0], arr[1], arr[2]));
const cubeSet = VectorSet();
cubes.forEach(c => cubeSet.add(c));

let zoneMin = newVector(-1, -1, -1);
let zoneMax = newMutableVector(0, 0, 0);
cubeSet.content.forEach(cube => {
	if (cube.x > zoneMax.x) zoneMax.x = cube.x;
	if (cube.y > zoneMax.y) zoneMax.y = cube.y;
	if (cube.z > zoneMax.z) zoneMax.z = cube.z;
});
zoneMax.x++;
zoneMax.y++;
zoneMax.z++;

let surfaceArea = 0;

const CLOSED = VectorSet();
const OPEN = VectorSet();
OPEN.add(newVector(0, 0, 0));

while (OPEN.content.length > 0) {
	explore();
	console.log("=== EXPLORING ===")
	console.log("Closed cubes:", CLOSED.content.length, "	Opened cubes:", OPEN.content.length)
	console.log("current surface area", surfaceArea);
}

console.log("=== COMPUTATION FINISHED ===")
console.log("Total surface area:", surfaceArea);

let endTime = new Date();
let timeDiff = endTime - startTime;
timeDiff /= 1000.0;
console.log("Computation took" , timeDiff, "seconds");

// functions

function explore() {
	const newlyOpened = VectorSet();
	for (const pos of OPEN.content) {
		for (const neighbor of pos.getNeighbors()) {
			if (isOutOfZone(neighbor)) continue;
			if (CLOSED.contains(neighbor)) continue;
			if (OPEN.contains(neighbor)) continue;

			if (cubeSet.contains(neighbor)) { // if neighbor is a rock cube
				surfaceArea++;
			} else { // if neighbor is an unexplored air cube
				newlyOpened.add(neighbor);
			}
		}
	}

	CLOSED.addAll(OPEN);
	OPEN.clear();
	OPEN.addAll(newlyOpened);

}

function isOutOfZone(vec) {
	if (vec.x < zoneMin.x || vec.y < zoneMin.y || vec.z < zoneMin.z) return true;
	if (vec.x > zoneMax.x || vec.y > zoneMax.y || vec.z > zoneMax.z) return true;
	return false;
}