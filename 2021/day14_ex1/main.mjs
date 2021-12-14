import { input } from "./input.mjs";
import InsertionRule from "./insertionRule.mjs";

let [strTemplate, rules] = input.split("\n\n");

let template = strTemplate.split("");

rules = rules.split("\n").map(string => {
	let [pair, result] = string.split(" -> ");
	return new InsertionRule(pair, result);
});

// console.log("Insertion rules:", rules);

console.log("Length:", template.length, "|", template.join(""));

for (let i = 0; i < 10; i++) {
	step();
}

console.log("Length:", template.length);

// Comptage des lettres
const letterMap = new Map();

for (const letter of template) {
	const number = letterMap.get(letter);
	
	if (number) letterMap.set(letter, number + 1);
	else letterMap.set(letter, 1);
}

let lettersCount = [];
for (const entry of letterMap) lettersCount.push(entry);

lettersCount.sort((array1, array2) => array1[1] - array2[1]);

console.log("Letter count:", lettersCount);

const mostCommonAmount = lettersCount[lettersCount.length - 1][1];
const leastCommonAmount = lettersCount[0][1];

console.log(`Difference: ${mostCommonAmount} - ${leastCommonAmount} = ${mostCommonAmount - leastCommonAmount}`)

// Functions

function step() {
	for (let i = 0; i+1 < template.length; i++) {
		const letter = template[i];
		const letter2 = template[i + 1];
	
		for (const rule of rules) {
			if (letter == rule.pair[0] && letter2 == rule.pair[1]) {
				template.splice(i+1, 0, rule.result);
				i++;
				break;
			}
		}
	}
}