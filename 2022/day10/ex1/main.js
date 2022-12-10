import { input } from "../input.js";

const instructions = input.split("\n").map(line => {
	if (line === "noop") {
		return {
			cmd: "noop",
			cyclesLeft: 1
		}
	}

	const match = line.match(/^addx (-?\d+)$/);
	if (match) {
		return {
			cmd: "addx",
			amount: parseInt(match[1]),
			cyclesLeft: 2
		}
	}

	console.log("Uuh error");
});

let x = 1;
let totalSignalStrength = 0;

for (let cycle = 1; instructions.length !== 0; cycle++) {

	if ((cycle - 20) % 40 === 0) {
		totalSignalStrength += cycle * x;
		console.log("cycle:", cycle, "	strength:", totalSignalStrength);
	}

	const inst = instructions[0];
	inst.cyclesLeft--;

	if (inst.cyclesLeft === 0) {
		instructions.shift();

		if (inst.cmd === "addx") {
			x += inst.amount;
		}
	}
}