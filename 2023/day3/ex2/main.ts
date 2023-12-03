import { input } from "../input.js";

const lineLength = input.indexOf('\n') + 1;
const schematicHeight = (input.length + 1) / lineLength;
console.log('width', lineLength - 1, 'height', schematicHeight);

const starsNeighborsMap: { [key: number]: number[] } = {};

const regexp = /\d+/g;
let match;
while (match = regexp.exec(input)) {
	const posY = Math.floor(match.index / lineLength);
	const startX = match.index % lineLength;
	const endX = startX + match[0].length;
	const number = parseInt(match[0]);
	
	getAdjacentStars(posY, startX, endX).forEach(starIndex => {
		if (!starsNeighborsMap[starIndex]) starsNeighborsMap[starIndex] = [];
		starsNeighborsMap[starIndex].push(number);
	});
}

let sum = 0;
Object.values(starsNeighborsMap).forEach(partNumbers => {
	if (partNumbers.length == 2) {
		sum += partNumbers[0] * partNumbers[1];
	}
});

console.log('Result:', sum);

// Functions

function getAdjacentStars(posY: number, startX: number, endX: number) {
	const stars: number[] = [];

	for (let x = startX - 1; x < endX + 1; x++) {
		for (let y = posY - 1; y < posY + 2; y++) {
			const charIndex = y * lineLength + x;
			const char = input[charIndex] ?? '.';
			if (char === '*') {
				stars.push(charIndex);
			}
		}
	}
	return stars;
}