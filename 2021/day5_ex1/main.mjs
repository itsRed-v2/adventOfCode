import { input } from "./input.mjs";

const diagram = [];

for (let x = 0; x < 1000; x++) {
	const row = [];
	for (let y = 0; y < 1000; y++) {
		row.push(0);
	}
	diagram.push(row);
}

const lines = input.split("\n");

for (const line of lines) {
	const points = line.split(" -> ");
	let co1 = points[0].split(",").map(string => parseInt(string));
	let co2 = points[1].split(",").map(string => parseInt(string));

	if (co1[0] === co2[0]) {
		// console.log("ver", co1, co2)

		if (co1[1] > co2[1]) {
			let temp = co1;
			co1 = co2;
			co2 = temp;
		}

		for (let y = co1[1]; y <= co2[1]; y++) {
			// console.log("marking:", co1[0], y);
			diagram[co1[0]][y] ++;
		}
	} 
	else if (co1[1] === co2[1]) {
		// console.log("hor", co1, co2)

		if (co1[0] > co2[0]) {
			let temp = co1;
			co1 = co2;
			co2 = temp;
		}
		
		for (let x = co1[0]; x <= co2[0]; x++) {
			// console.log("marking:", x, co1[1]);
			diagram[x][co1[1]] ++;
		}
	}
}

let totalOver2 = 0;

for (const row of diagram) {
	for (const number of row) {
		if (number > 1) totalOver2++;
	}
}

console.log("pointsOver2:", totalOver2);