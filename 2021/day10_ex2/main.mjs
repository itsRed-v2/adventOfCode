import { input } from "../day10_ex1/input.mjs";

const lines = input.split("\n");

const charScores = new Map();
charScores.set("(", 1);
charScores.set("[", 2);
charScores.set("{", 3);
charScores.set("<", 4);

let linesScores = [];

for (let i = 0; i < lines.length; i++) {
	inspectLine(lines[i], i);
}

linesScores.sort((a, b) => a - b);

// console.log(linesScores)
console.log("middle score:", linesScores[Math.floor(linesScores.length / 2)])

// Functions

function inspectLine(line, index) {

	let chunks = [];

	for (const char of line) {
		if (char === "(" || char === "[" || char === "{" || char === "<") {
			chunks.push(char);
		}
		if (char === ")" || char === "]" || char === "}" || char === ">") {
			if (invertBrace(chunks[chunks.length - 1]) === char) {
				chunks.pop();
			} else {
				// console.log(`Skipped line ${index + 1}.`);
				return;
			}
		}
	}

	// console.log("Line", index + 1);
	// console.log("incomplete chunks:", chunks.length, chunks);

	let score = 0;
	for (const char of chunks.reverse()) {
		score *= 5;
		score += charScores.get(char);
	}

	// console.log("score:", score);
	linesScores.push(score);

}



function invertBrace(char) {
	if (char === "(") return ")";
	if (char === "[") return "]";
	if (char === "{") return "}";
	if (char === "<") return ">";
	if (char === ")") return "(";
	if (char === "]") return "[";
	if (char === "}") return "{";
	if (char === ">") return "<";
}