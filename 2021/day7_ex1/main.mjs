import { input } from "./input.mjs";

let crabs = input.replace("\n", "").split(",").map(string => parseInt(string));

let leastFuel = 10000000;
let bestPosition;

for (let position = 0; position < 2000; position++) {
	let totalfuel = 0;

	for (let value of crabs) {
		let fuel = value - position;
		if (fuel < 0) fuel *= -1;
		totalfuel += fuel;
	}

	if (totalfuel < leastFuel) {
		leastFuel = totalfuel;
		bestPosition = position;
	}
}

console.log("bestPosition:", bestPosition, "fuel:", leastFuel);