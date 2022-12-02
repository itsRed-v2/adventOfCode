import { input } from "../input.js"

const result = input.split("\n").map(pair => {
	const isWin = match(pair[0], pair[2]);
	const played = convertCodeToObject(pair[2]);

	let score = 0;

	score += {
		"loose": 0,
		"draw": 3,
		"win": 6
	}[isWin];

	score += {
		"rock": 1,
		"paper": 2,
		"scissors": 3
	}[played];

	return score;
}).reduce((accumulator, val) => accumulator + val);

console.log(result);

function match(opponentCode, ourCode) {
	const a = convertCodeToObject(opponentCode);
	const b = convertCodeToObject(ourCode);

	if (a === b) return "draw";
	
	return {
		"rock": {
			"paper": "win",
			"scissors": "loose"
		},
		"paper": {
			"rock": "loose",
			"scissors": "win"
		},
		"scissors": {
			"rock": "win",
			"paper": "loose"
		}
	}[a][b];
}

function convertCodeToObject(symbol) {
	return {
		"A": "rock",
		"B": "paper",
		"C": "scissors",
		"X": "rock",
		"Y": "paper",
		"Z": "scissors"
	}[symbol];
}