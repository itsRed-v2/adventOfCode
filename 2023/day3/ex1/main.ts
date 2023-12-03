import { input } from "../input.js";

const schematicWidth = input.indexOf('\n') + 1;
const schematicHeight = (input.length + 1) / schematicWidth;
console.log('width', schematicWidth - 1, 'height', schematicHeight);

const regexp = /\d+/g;
let sum = 0;
let match;
while (match = regexp.exec(input)) {
	const posY = Math.floor(match.index / schematicWidth);
	const startX = match.index % schematicWidth;
	const endX = startX + match[0].length;
	
	if (isPartNumber(posY, startX, endX)) {
		sum += parseInt(match[0]);
	}
}

console.log('Result:', sum);

// Functions

function isPartNumber(posY: number, startX: number, endX: number) {
	for (let x = startX - 1; x < endX + 1; x++) {
		for (let y = posY - 1; y < posY + 2; y++) {
			const charIndex = y * schematicWidth + x;
			const char = input[charIndex] ?? '.';
			if (!char.match(/\.|\n|\d/)) return true;
		}
	}
	return false;
}