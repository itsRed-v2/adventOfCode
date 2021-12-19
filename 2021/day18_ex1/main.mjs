import { input } from "./input.mjs";
import { addNumbers, calculateMagnitude } from "./functions.mjs";

const numbers = input.split("\n");

let currentNumber = numbers[0];
for (let i = 1; i < numbers.length; i++) {
	currentNumber = addNumbers(currentNumber, numbers[i]);
}

console.log("number:", currentNumber);

console.log("magnitude:", calculateMagnitude(eval(currentNumber)));