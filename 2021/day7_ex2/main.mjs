import { input } from "../day7_ex1/input.mjs";

let crabs = input.replace("\n", "").split(",").map(string => parseInt(string));

let leastFuel;
let bestPosition;

for (let position = 0; position < 2000; position++) {
	let totalfuel = 0;

	for (let crabPos of crabs) {
		let distance = crabPos - position;

		if (distance < 0) distance *= -1;

		totalfuel += calculateFuel(distance);
	}

	if (totalfuel < leastFuel || !leastFuel) {
		leastFuel = totalfuel;
		bestPosition = position;
	}
}

console.log("bestPosition:", bestPosition, "fuel:", leastFuel);

function calculateFuel(distance) {
	let fuel = 0;
	for (let i = 1; i <= distance; i++) {
		fuel += i;
	}
	return fuel;
}