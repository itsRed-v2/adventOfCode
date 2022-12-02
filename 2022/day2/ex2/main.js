import { input } from "../input.js";

const result = input.split("\n").map(pair => {
	const roundEnd = {
		"X": "lose",
		"Y": "draw",
		"Z": "win"
	}[pair[2]];

	const opponentObject = {
		"A": "rock",
		"B": "paper",
		"C": "scissors"
	}[pair[0]];

	const playedObject = thinkPlay(roundEnd, opponentObject);
	return calculateScore(roundEnd, playedObject);
}).reduce((accumulator, val) => accumulator + val);

console.log(result);

function thinkPlay(roundEnd, opponentObject) {
	if (roundEnd === "draw") return opponentObject;

	return {
		"win": {
			"rock": "paper",
			"paper": "scissors",
			"scissors": "rock"
		},
		"lose": {
			"rock": "scissors",
			"paper": "rock",
			"scissors": "paper"
		}
	}[roundEnd][opponentObject];
}

function calculateScore(roundEnd, playedObject) {
	let score = 0;

	score += {
		"rock": 1,
		"paper": 2,
		"scissors": 3
	}[playedObject];

	score += {
		"lose": 0,
		"draw": 3,
		"win": 6
	}[roundEnd];

	return score;
}