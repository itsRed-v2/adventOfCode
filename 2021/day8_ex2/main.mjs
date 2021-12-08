import { input } from "../day8_ex1/input.mjs";

import {
	onlyKeepMatching,
	isArrayContained,
	removeArrayElement,
	equalArray,
} from "./functions.mjs";

const lines = input.split("\n");

let totalOutputValues = 0;

let knownPatterns;
let unknownDigits;

let A, B, C, D, E, F, G;

for (const line of lines) {

	const patterns = line.split(" | ")[0].split(" ");

	knownPatterns = new Map();
	unknownDigits = [0, 1, 2, 3, 4, 5, 6 ,7, 8, 9];

	// ces variables représentent les segments avec chacun les cables qui pourraient y être connectés
	// lettre majuscule désigne le segment; lettre minuscule désigne le fil de connection
	A = ["a", "b", "c", "d", "e", "f", "g"];
	B = ["a", "b", "c", "d", "e", "f", "g"];
	C = ["a", "b", "c", "d", "e", "f", "g"];
	D = ["a", "b", "c", "d", "e", "f", "g"];
	E = ["a", "b", "c", "d", "e", "f", "g"];
	F = ["a", "b", "c", "d", "e", "f", "g"];
	G = ["a", "b", "c", "d", "e", "f", "g"];

	// Première élimination de possibilités (nombres 1, 4, 7 et 8)
	for (const pattern of patterns) {
		if (pattern.length == 2) addKnownPattern(pattern, 1);
		if (pattern.length == 4) addKnownPattern(pattern, 4);
		if (pattern.length == 3) addKnownPattern(pattern, 7);
		if (pattern.length == 7) addKnownPattern(pattern, 8);
	}

	// Seconde élimination (nombres 0, 6, 9)
	for (let i = 0; i < 3; i++) {
		for (const pattern of patterns) {
			const displayedSegments = pattern.split("");
		
			if (pattern.length == 6) {
				let possibleDigits = onlyKeepMatching([0, 6, 9], unknownDigits);
				if (isArrayContained(D, displayedSegments)) removeArrayElement(possibleDigits, 0);
				if (isArrayContained(C, displayedSegments)) removeArrayElement(possibleDigits, 6);
				if (isArrayContained(E, displayedSegments)) removeArrayElement(possibleDigits, 9);
		
				if (possibleDigits.length === 1) {
					addKnownPattern(pattern, possibleDigits[0]);
				}
			}
		}
	}

	// Troisième élimination (nombres 2, 3 et 5)
	for (let i = 0; i < 3; i++) {
		for (const pattern of patterns) {
			const displayedSegments = pattern.split("");
		
			if (pattern.length == 5) {
				let possibleDigits = onlyKeepMatching([2, 3, 5], unknownDigits);
				if (isArrayContained(B, displayedSegments) || isArrayContained(F, displayedSegments)) removeArrayElement(possibleDigits, 2);
				if (isArrayContained(B, displayedSegments) || isArrayContained(E, displayedSegments)) removeArrayElement(possibleDigits, 3);
				if (isArrayContained(C, displayedSegments) || isArrayContained(E, displayedSegments)) removeArrayElement(possibleDigits, 5);
		
				if (possibleDigits.length === 1) {
					addKnownPattern(pattern, possibleDigits[0]);
				}
			}
		}
	}

	// console.log("A:", A);
	// console.log("B:", B);
	// console.log("C:", C);
	// console.log("D:", D);
	// console.log("E:", E);
	// console.log("F:", F);
	// console.log("G:", G);

	// console.log("knownPatterns:", knownPatterns);

	if (!knownPatterns.size == 10) console.error("Can't decode digits on this line!:", line);
	else {
		const outputValues = line.split(" | ")[1].split(" ");

		let decodedOutput = "";

		for (const value of outputValues) {
			
			for (const key of knownPatterns.keys()) {
				let arrayValue = value.split("");
				let arrayKey = key.split("");

				if (equalArray(arrayValue, arrayKey)) {
					decodedOutput += knownPatterns.get(key);
					break;
				}
			}

		}
		
		console.log("decodedOutput:", parseInt(decodedOutput));
		totalOutputValues += parseInt(decodedOutput);
	}

}

console.log("totalOutputValues", totalOutputValues);

function addKnownPattern(pattern, digit) {
	knownPatterns.set(pattern, digit);
	removeArrayElement(unknownDigits, digit);

	const segments = pattern.split("");

	const digitSegments = [
		"abcefg",
		"cf",
		"acdeg",
		"acdfg",
		"bcdf",
		"abdfg",
		"abdefg",
		"acf",
		"abcdefg",
		"abcdfg"
	]

	for (const letter of digitSegments[digit].split("")) {
		if (letter == "a") A = onlyKeepMatching(A, segments);
		else if (letter == "b") B = onlyKeepMatching(B, segments);
		else if (letter == "c") C = onlyKeepMatching(C, segments);
		else if (letter == "d") D = onlyKeepMatching(D, segments);
		else if (letter == "e") E = onlyKeepMatching(E, segments);
		else if (letter == "f") F = onlyKeepMatching(F, segments);
		else if (letter == "g") G = onlyKeepMatching(G, segments);
	}
}