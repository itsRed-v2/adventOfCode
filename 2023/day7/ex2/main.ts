import { input } from "../input.js";

const cardScores = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];

const rankedHands = input.split('\n').sort((lineA, lineB) => {
	const handA = lineA.split(' ')[0];
	const handB = lineB.split(' ')[0];

	const strengthA = getHandTypeStrength(handA);
	const strengthB = getHandTypeStrength(handB);

	if (strengthA - strengthB !== 0) return strengthA - strengthB;
	return compareHandsByCardStrength(handA, handB);
});

console.log(rankedHands.map((line, index) => {
	return parseInt(line.split(' ')[1]) * (index + 1);
}).reduce((a, b) => a + b));

function getHandTypeStrength(hand: string) {
	const cardsCounts = decompose(hand);

	let predicates = [
		cardsCounts.includes(5), // Five of a kind
		cardsCounts.includes(4), // Four of a kind
		cardsCounts.includes(3) && cardsCounts.includes(2), // Full house
		cardsCounts.includes(3), // Three of a kind
		countPairs(cardsCounts) === 2, // Two pairs
		countPairs(cardsCounts) === 1, // One pair
		cardsCounts.every(value => value === 1), // High card
	];

	for (let i = 0, score = 7; i < predicates.length; i++, score--) {
		if (predicates[i]) return score;
	}

	throw new Error("Wtf ? Hand has no type.");
}

function decompose(hand: string) {
	let cards: { [key: string]: number; } = {};
	for (const char of hand) {
		if (!cards[char])
			cards[char] = 0;
		cards[char]++;
	}

	let jokerCount = cards['J'] ?? 0;
	delete cards['J'];
	if (jokerCount == 5) return [5];

	let mostFrequent: [string, number] = Object.entries(cards).reduce((bestEntry, entry) => bestEntry[1] > entry[1] ? bestEntry : entry);
	let mostFrequentCard: string = mostFrequent[0];
	cards[mostFrequentCard] += jokerCount;

	return Object.values(cards);
}

function countPairs(cardsCounts: number[]) {
	return cardsCounts.reduce((pairCount, occurences) => {
		return occurences === 2 ? pairCount + 1 : pairCount;
	}, 0);
}

function compareHandsByCardStrength(handA: string, handB: string) {
	for (let i = 0; i < 5; i++) {
		const scoreA = cardScores.indexOf(handA[i]);
		const scoreB = cardScores.indexOf(handB[i]);
		if (scoreA - scoreB !== 0) return scoreA - scoreB;
	}
	return 0;
}