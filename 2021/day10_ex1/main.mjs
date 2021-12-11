import { input } from "./input.mjs";

const lines = input.split("\n");

const charScores = new Map();
charScores.set(")", 3);
charScores.set("]", 57);
charScores.set("}", 1197);
charScores.set(">", 25137);

let totalScore = 0;

for (let i = 0; i < lines.length; i++) {
	
	const line = lines[i];

	let chunks = [];

	for (const char of line) {
		if (char === "(" || char === "[" || char === "{" || char === "<") {
			chunks.push(char);
		}
		if (char === ")" || char === "]" || char === "}" || char === ">") {
			if (invertBrace(chunks[chunks.length - 1]) === char) {
				chunks.pop();
			} else {
				console.log(`Line ${i+1}: Expected ${invertBrace(chunks[chunks.length - 1])}, but found ${char} instead.`);
				totalScore += charScores.get(char);
				break;
			}
		}
	}

}

console.log("Total syntax error score:", totalScore);

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