import Coordinates from "../day13_ex1/coordinates.mjs";
import { input } from "../day13_ex1/input.mjs";

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

// Pliage du papier
for (const instruction of instructions) {
	for (const co of dots) {
		co.flip(instruction[0], instruction[1]);
	}
}

// Affichage du papier plié
let display = [];
for (let i = 0; i < 10; i++) display.push([]);

for (const co of dots) {
	display[co.y][co.x] = true;
}

for (const row of display) {
	let line = "";
	
	for (const dot of row) {
		if (dot) line += "#";
		else line += " ";
	}

	console.log(line);
}