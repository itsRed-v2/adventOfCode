import { input } from "./input.mjs";

const numbers = input.split('\n').map(str => parseInt(str));
for (const n of numbers) {
	if (numbers.includes(2020 - n))
	console.log(n * (2020 - n));
}