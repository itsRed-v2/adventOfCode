import { input } from "../input.js";

const priorities = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

console.log(input.split("\n").map(items => {
	const compartmentSize = items.length / 2;
	const compartment1 = items.slice(0, compartmentSize).split("");
	const compartment2 = items.slice(compartmentSize).split("");

	const sharedType = compartment1.find(char => compartment2.some(char2 => char === char2));
	const priority = priorities.indexOf(sharedType) + 1;
	return priority;
}).reduce((a, v) => a + v));