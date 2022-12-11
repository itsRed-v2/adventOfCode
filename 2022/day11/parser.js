export {
	parseMonkeys
}

function parseMonkeys(string) {
	let monkeyStrings = string.split("\n\n");

	return monkeyStrings.map(str => parseMonkey(str));
}

function parseMonkey(string) {
	const lines = string.split("\n");

	const startingItemsMatch = lines[1].match(/Starting items: ((?:\d+,? ?)+)$/);
	const startingItems = startingItemsMatch[1].split(", ").map(str => parseInt(str));

	const operationMatch = lines[2].match(/Operation: new = (.+)$/);
	const operation = old => eval(operationMatch[1]);

	const testValue = lines[3].match(/Test: divisible by (\d+)/)[1];
	const ifTrue = lines[4].match(/If true: throw to monkey (\d+)/)[1];
	const ifFalse = lines[5].match(/If false: throw to monkey (\d+)/)[1];

	return {
		items: startingItems,
		operation: operation,
		testValue: testValue,
		ifTrue: ifTrue,
		ifFalse: ifFalse,
		inspectionNb: 0
	};
}