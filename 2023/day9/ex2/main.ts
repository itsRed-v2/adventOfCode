import { input } from "../input.js";

console.log(input.split('\n').map(extrapolate).reduce((a, b) => a + b));

function extrapolate(line: string) {
	let firstSequence = line.split(' ').map(s => parseInt(s));
	let sequences = [firstSequence];

	while (!isAllZero(last(sequences))) {
		sequences.push(computeNextSequence(last(sequences)));
	}

	last(sequences).unshift(0);
	for (let i = sequences.length - 2; i >= 0; i--) {
		let currentSequence = sequences[i];
		let sequenceAfter = sequences[i + 1];
		currentSequence.unshift(currentSequence[0] - sequenceAfter[0]);
	}
	
	return sequences[0][0];
}

function last<Type>(list: Type[]) {
	return list[list.length - 1];
}

function isAllZero(sequence: number[]) {
	return sequence.every(n => n === 0);
}

function computeNextSequence(sequence: number[]) {
	let next = [];
	for (let i = 0; i < sequence.length - 1; i++) {
		next[i] = sequence[i + 1] - sequence[i];
	}
	return next;
}