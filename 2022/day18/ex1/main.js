import { input } from "../input.js";

import { newVector } from "../vector.js";

const cubes = input.split("\n").map(line => line.split(",").map(strNb => parseInt(strNb))).map(arr => newVector(arr[0], arr[1], arr[2]));

let surfaceArea = 0;

cubes.forEach(cube => {
	cube.getNeighbors().forEach(neighbour => {
		for (const c of cubes) {
			if (neighbour.equals(c)) return;
		}
		surfaceArea++;
	});
});

console.log(surfaceArea);