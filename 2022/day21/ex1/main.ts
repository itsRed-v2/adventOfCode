import { input } from "../input.js";

interface OperationMonkey {
	parent1: string,
	parent2: string,
	operation: string,
}

const solvedMonkeys = new Map<string, number>();
const operationMonkeys = new Map<string, OperationMonkey>();

input.split("\n").forEach((line: string) => {
	let matchNumberMonkey = line.match(/^(....): (\d+)$/);
	let matchOperationMonkey = line.match(/^(....): (....) ([-+*/]) (....)$/);

	if (matchNumberMonkey) {
		let name = matchNumberMonkey[1];
		let number = parseInt(matchNumberMonkey[2]);

		solvedMonkeys.set(name, number);
	} else if (matchOperationMonkey) {
		let name = matchOperationMonkey[1];
		let parent1 = matchOperationMonkey[2];
		let operation = matchOperationMonkey[3];
		let parent2 = matchOperationMonkey[4];

		let monkey: OperationMonkey = {
			parent1,
			parent2,
			operation
		}
		operationMonkeys.set(name, monkey);
	}
});

while (operationMonkeys.size > 0) {
	for (const entry of operationMonkeys) {
		const name = entry[0];
		const monkey = entry[1];
	
		let v1 = solvedMonkeys.get(monkey.parent1);
		let v2 = solvedMonkeys.get(monkey.parent2);
		if (!v1 || !v2) continue;
	
		let result: number;
	
		switch (monkey.operation) {
			case "+":
				result = v1 + v2;
				break;
			case "-":
				result = v1 - v2;
				break;
			case "*":
				result = v1 * v2;
				break;
			case "/":
				result = v1 / v2;
		}
	
		operationMonkeys.delete(name);
		solvedMonkeys.set(name, result);
	}

}

console.log("root's number:", solvedMonkeys.get("root"));