import { input } from "./input.mjs";
import Board from "./board.mjs";

const lines = input.split("\n")

const numbers = lines[0].split(",").map(string => parseInt(string))

lines.shift()
lines.shift()

const boards = [];

let boardValues = [];

for (let i = 0; i < lines.length; i++) {
	if (lines[i] === "") {
		boards.push(new Board(boardValues))
		boardValues = [];
	} else {
		const row = lines[i].trim().split(/ +/).map(string => parseInt(string))
		boardValues.push(row)
	}
}

playBingo(numbers, boards);

function playBingo(numbers, boards) {
	for (const number of numbers) {
		for (const board of boards) {
			if (board.mark(number) === true) {
				console.log("WinningBoard:", board);
				console.log("WinnerNumber:", number);
				console.log("Score:", calculateScore(board, number))
				return;
			}
		}
	}
}

function calculateScore(board, number) {
	let sum = 0;

	for (let y = 0; y < 5; y++) {
		for (let x = 0; x < 5; x++) {
			if (board.rows[y][x] != true) sum += board.rows[y][x];
		}
	}

	return sum * number;
}