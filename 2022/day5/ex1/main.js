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

function moveCrate(from, to) {
	stacks[to].push(stacks[from].pop());
}

for (const instruction of procedure) {
	for (let i = 0; i < instruction.nbOfCrates; i++) {
		moveCrate(instruction.from, instruction.to);
	}
}

let topCrates = "";
for (let stack of stacks) {
	topCrates += stack.pop();
}
console.log(topCrates);