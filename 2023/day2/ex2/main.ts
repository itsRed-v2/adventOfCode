import { input } from "../input.js";

type Color = 'red' | 'green' | 'blue';

console.log(input.split("\n").map((game, index) => {
	const cubes = game.match(/\d+ (?:red|green|blue)/g) as RegExpMatchArray;

	const minCubes = {
		red: 0,
		green: 0,
		blue: 0,
	};

	cubes.forEach(cubeStr => {
		const amount = parseInt(cubeStr.split(' ')[0]);
		const color = cubeStr.split(' ')[1] as Color;
		minCubes[color] = Math.max(amount, minCubes[color]);
	});

	return minCubes.red * minCubes.green * minCubes.blue;
}).reduce((a, b) => a + b));