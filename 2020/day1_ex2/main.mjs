import { input } from "../day1_ex1/input.mjs";

const numbers = input.split('\n').map(str => parseInt(str));
for (const n1 of numbers) {
	for (const n2 of numbers) {
		const n3 = 2020 - n1 - n2;
		if (numbers.includes(n3)) {
			console.log(n1, n2, n3);
			console.log(n1 * n2 * n3);
		}
	} 
}