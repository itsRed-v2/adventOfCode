import { input } from "../day14_ex1/input.mjs";
import InsertionRule from "../day14_ex1/insertionRule.mjs";

let [template, rules] = input.split("\n\n");

rules = rules.split("\n").map(string => {
	let [pair, result] = string.split(" -> ");
	return new InsertionRule(pair, result);
});

// console.log("Insertion rules:", rules);

console.log("Length:", template.length, "|", template);

const letterCount = new Map();
let pairCount = new Map();

for (const char of template) {
	addValueToMap(letterCount, char, 1);
}

for (let i = 0; i+1 < template.length; i++) {
	addValueToMap(pairCount, template[i] + template[i + 1], 1);
}

console.log("INITIAL Letter count:", letterCount);
console.log("INITIAL Pair count:", pairCount);

for (let i = 0; i < 40; i++) {
	step();
}

console.log("FINAL Letter count:", letterCount);
console.log("FINAL Pair count:", pairCount);

// Calcul du score final
let lettersCount = [];
for (const entry of letterCount) lettersCount.push(entry);

lettersCount.sort((array1, array2) => array1[1] - array2[1]);

console.log("Sorted letter count:", lettersCount);

const mostCommonAmount = lettersCount[lettersCount.length - 1][1];
const leastCommonAmount = lettersCount[0][1];

console.log(`Difference: ${mostCommonAmount} - ${leastCommonAmount} = ${mostCommonAmount - leastCommonAmount}`)

// Functions

function step() {

	let newPairCount = new Map();

	for (const [pair, amount] of pairCount.entries()) {

		for (const rule of rules) {
			if (pair == rule.pair) {
				addValueToMap(letterCount, rule.result, amount);
				
				let newPair1 = pair[0] + rule.result;
				let newPair2 = rule.result + pair[1];

				addValueToMap(newPairCount, newPair1, amount);
				addValueToMap(newPairCount, newPair2, amount);
				break;
			}
		}
		
	}

	pairCount = newPairCount;
}

function addValueToMap(map, key, value) {
	const oldValue = map.get(key);
	
	if (oldValue) map.set(key, oldValue + value);
	else map.set(key, value);
}