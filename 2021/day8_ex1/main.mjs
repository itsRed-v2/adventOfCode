import { input } from "./input.mjs";

const outputValues = input.split("\n").map(string => string.split(" | ")[1]);
const digits = outputValues.join(" ").split(" ");

let digit1 = 0;
let digit4 = 0;
let digit7 = 0;
let digit8 = 0;

for (const letters of digits) {
	if (letters.length == 2) digit1++;
	else if (letters.length == 4) digit4++;
	else if (letters.length == 3) digit7++;
	else if (letters.length == 7) digit8++;
}

console.log("digit1:", digit1);
console.log("digit4:", digit4);
console.log("digit7:", digit7);
console.log("digit8:", digit8);

console.log("sum:", digit1 + digit4 + digit7 + digit8);