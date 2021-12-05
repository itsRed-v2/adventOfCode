import { input } from "../day4_ex1/input.mjs";
import Board from "../day4_ex1/board.mjs"

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

		boards = boards.filter(board => {
			if (board.mark(number)) {
				if (boards.length === 1) {
					console.log("LoosingBoard:", boards[0]);
					console.log("Number:", number);
					console.log("Score:", calculateScore(boards[0], number));
				}
				return false;
			}
			return true;
			})
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