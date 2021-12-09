import Coordinates from "./coordinates.mjs";
import { input } from "../day9_ex1/input.mjs";

const rows = input.split("\n");

let exploredArray;

let basinSizes = [];

for (let x = 0; x < rows.length; x++) {
	for (let y = 0; y < rows[x].length; y++) {
		
		if (isLowPoint(x, y)) {

			exploredArray = [];
			exploreBasin(x, y);
			
			basinSizes.push(exploredArray.length);
			console.log("size", exploredArray.length);
		}

	}	
}

let biggestBasinSizes = [];

for (let i = 0; i < 3; i++) {
	let biggestValue = Math.max(...basinSizes);

	biggestBasinSizes.push(biggestValue);

	let index = basinSizes.indexOf(biggestValue);
	basinSizes.splice(index, 1);
}

console.log(biggestBasinSizes);

let multiplied = 1;
for (const value of biggestBasinSizes) {
	multiplied *= value;
}
console.log("multiplied:", multiplied);

// Fonctions

function isLowPoint(x, y) {
	const height = rows[x][y];

	if (rows[x+1] && height >= rows[x+1][y]) return false;
	if (rows[x-1] && height >= rows[x-1][y]) return false;
	if (rows[x][y+1] && height >= rows[x][y+1]) return false;
	if (rows[x][y-1] && height >= rows[x][y-1]) return false;
	
	return true;
}

function exploreBasin(x, y) {
	const height = rows[x][y];
	if (height == 9) return;

	exploredArray.push(new Coordinates(x, y));

	if (rows[x+1] && height <= rows[x+1][y] && !isExplored(new Coordinates(x+1, y))) exploreBasin(x+1, y);
	if (rows[x-1] && height <= rows[x-1][y] && !isExplored(new Coordinates(x-1, y))) exploreBasin(x-1, y);
	if (rows[x][y+1] && height <= rows[x][y+1] && !isExplored(new Coordinates(x, y+1))) exploreBasin(x, y+1);
	if (rows[x][y-1] && height <= rows[x][y-1] && !isExplored(new Coordinates(x, y-1))) exploreBasin(x, y-1);
}

function isExplored(coordinates) {
	for (const exploredCoordinate of exploredArray) {
		if (exploredCoordinate.equals(coordinates)) return true;
	}
	return false;
}