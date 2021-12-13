import Coordinates from "./coordinates.mjs";
import { input } from "./input.mjs";

let [dots, instructions] = input.split("\n\n");

dots = dots.split("\n").map(line => {
	let cos = line.split(",").map(str => parseInt(str));
	return new Coordinates(cos[0], cos[1]);
});

instructions = instructions.split("\n").map(line => {
	let pair = line.substring(11).split("=");
	pair[1] = parseInt(pair[1]);
	return pair;
});

for (const co of dots) {
	co.flip(instructions[0][0], instructions[0][1]);
}

// Création d'un array sans points en double
let uniqueDots = [];

for (const co of dots) {
	if (contains(uniqueDots, co)) continue;
	uniqueDots.push(co);
}

console.log(uniqueDots.length);


// Functions

function contains(array, coordinate) {
	for (const co of array) {
		if (co.equals(coordinate)) return true;
	}
	return false;
}