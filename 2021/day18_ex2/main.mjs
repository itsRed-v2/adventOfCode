import { input } from "../day18_ex1/input.mjs";
import { addNumbers, calculateMagnitude } from "../day18_ex1/functions.mjs";

const numbers = input.split("\n");

let largestMagnitude = 0;

for (let i1 = 0; i1 < numbers.length; i1++) {
	for (let i2 = 0; i2 < numbers.length; i2++) {
		if (i1 === i2) continue;

		let magnitude = calculateMagnitude(eval(addNumbers(numbers[i1], numbers[i2])));
		if (magnitude > largestMagnitude) largestMagnitude = magnitude;

		magnitude = calculateMagnitude(eval(addNumbers(numbers[i2], numbers[i1])));
		if (magnitude > largestMagnitude) largestMagnitude = magnitude;
	}
}

console.log("largest magnitude:", largestMagnitude);