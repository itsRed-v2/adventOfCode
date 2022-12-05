import { input } from "../input.js";

const inputSections = input.split("\n\n");

let startingStacksStrings = inputSections[0].split("\n").map(line => {
	let simplifiedLine = "";
	for (let i = 1; i < line.length; i += 4) {
		simplifiedLine += line[i];
	}
	return simplifiedLine;
});
startingStacksStrings.pop();

const stacks = [];
for (const line of startingStacksStrings) {
	line.split("").forEach((char, index) => {
		if (stacks[index] === undefined) {
			stacks[index] = [];
		}
		if (char != " ") {
			stacks[index].unshift(char);
		}
	});
}

const procedure = inputSections[1].split("\n").map(line => {
	const match = line.match(/move (\d+) from (\d+) to (\d+)/);
	return {
		nbOfCrates: parseInt(match[1]),
		from: parseInt(match[2]) - 1,
		to: parseInt(match[3]) - 1
	};
});

function moveCrate(amount, from, to) {
	const fromCol = stacks[from]
	const movedCrates = fromCol.splice(fromCol.length - amount, amount);
	const toCol = stacks[to];
	toCol.push(...movedCrates);
}

for (const instruction of procedure) {
	moveCrate(instruction.nbOfCrates, instruction.from, instruction.to);
}

let topCrates = "";
for (let stack of stacks) {
	topCrates += stack.pop();
}
console.log(topCrates);