import { input } from "./input.mjs";

let oxygenPossibilities = input.split("\n");
let oxygen;

for (let position = 0; position < 12; position++) {
	let ones = 0;
	let zeros = 0;

	for (const string of oxygenPossibilities) {
		if (string[position] === "1") ones += 1;
		else zeros += 1;
	}

	let mostCommon;

	if (zeros > ones) mostCommon = "0";
	else mostCommon = "1";

	for (let index = 0; index < oxygenPossibilities.length;) {
		if (oxygenPossibilities[index][position] != mostCommon) {
			oxygenPossibilities.splice(index, 1);
		} else index++;
	}

	if (oxygenPossibilities.length === 1) {
		oxygen = oxygenPossibilities[0];
		break;
	}
}

console.log("oxygen:", oxygen);
	

let co2Possibilities = input.split("\n");
let co2;

for (let position = 0; position < 12; position++) {
	let ones = 0;
	let zeros = 0;

	for (const string of co2Possibilities) {
		if (string[position] === "1") ones += 1;
		else zeros += 1;
	}

	let leastCommon;

	if (ones < zeros) leastCommon = "1";
	else leastCommon = "0";

	for (let index = 0; index < co2Possibilities.length;) {
		if (co2Possibilities[index][position] != leastCommon) {
			co2Possibilities.splice(index, 1);
		} else index++;
	}

	if (co2Possibilities.length === 1) {
		co2 = co2Possibilities[0];
		break;
	}
}

console.log("co2:", co2);