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

let drawnPixels = [];

for (let cycle = 1; instructions.length !== 0; cycle++) {
	// cycle "during"

	const drawingIndex = (cycle - 1) % 40;
	const isLitPixel = drawingIndex === x - 1 || drawingIndex === x || drawingIndex === x + 1;
	drawnPixels.push(isLitPixel);

	// cycle end

	const inst = instructions[0];
	inst.cyclesLeft--;

	if (inst.cyclesLeft === 0) {
		instructions.shift();

		if (inst.cmd === "addx") {
			x += inst.amount;
		}
	}
}

let drawingLine = "";
drawnPixels.forEach(isLit => {
	drawingLine += isLit ? "#" : " ";

	if (drawingLine.length === 40) {
		console.log(drawingLine);
		drawingLine = "";
	}
});