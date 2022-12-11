import { input } from "../input.js";
import { parseMonkeys } from "../parser.js";

const monkeys = parseMonkeys(input);

// do 20 rounds
for (let round = 0; round < 20; round++) {
	for (const monkey of monkeys) {
		monkeyTurn(monkey);
	}
}

monkeys.sort((monkeyA, monkeyB) => {
	return monkeyB.inspectionNb - monkeyA.inspectionNb;
});

const monkeyBuisnessLevel = monkeys[0].inspectionNb * monkeys[1].inspectionNb;
console.log(monkeyBuisnessLevel);

function monkeyTurn(monkey) {
	while (monkey.items.length > 0) {
		let worryLevel = monkey.items.shift();

		monkey.inspectionNb++;
		worryLevel = monkey.operation(worryLevel);
		worryLevel = Math.floor(worryLevel / 3);

		if (worryLevel % monkey.testValue === 0) {
			monkeys[monkey.ifTrue].items.push(worryLevel);
		} else {
			monkeys[monkey.ifFalse].items.push(worryLevel);
		}
	}
}