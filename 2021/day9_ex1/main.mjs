import { input } from "./input.mjs";

const rows = input.split("\n");

let riskLevel = 0;

for (let x = 0; x < rows.length; x++) {
	for (let y = 0; y < rows[x].length; y++) {
		
		if (isLowPoint(x, y)) {
			console.log("height", parseInt(rows[x][y]));
			riskLevel += parseInt(rows[x][y]) + 1;
		}

	}	
}

console.log("riskLevel:", riskLevel);

function isLowPoint(x, y) {
	const height = rows[x][y];

	if (rows[x+1] && height >= rows[x+1][y]) return false;
	if (rows[x-1] && height >= rows[x-1][y]) return false;
	if (rows[x][y+1] && height >= rows[x][y+1]) return false;
	if (rows[x][y-1] && height >= rows[x][y-1]) return false;
	
	return true;
}