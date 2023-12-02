import { input } from "../input.js";

type Color = 'red' | 'green' | 'blue';

const maxCubes = {
	red: 12,
	green: 13,
	blue: 14
};

console.log(input.split("\n").map((game, index) => {
	const gameId = index + 1;
	const cubes = game.match(/\d+ (?:red|green|blue)/g) as RegExpMatchArray;
	const possible = cubes.every(cubeStr => {
		const [amount, color] = cubeStr.split(' ');
		return maxCubes[color as Color] >= parseInt(amount);
	});
	return possible ? gameId : 0;
}).reduce((a, b) => a + b));