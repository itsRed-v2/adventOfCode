import { input } from "../day11_ex1/input.mjs";

const rows = input.split("\n").map(string => string.split("").map(str => parseInt(str)));

let step = 0;

simulate();

function simulate() {
	step++;
	console.log(`Step ${step} -------------`);
	calculateStep();
	if (containsOnly0()) {
		console.log("first step whete everything flashes:", step);
		return;
	}
	setTimeout(simulate, 100);
}

function calculateStep() {

	// ajout de 1 au niveau d'énergie
	for (let x = 0; x < rows.length; x++) {
		for (let y = 0; y < rows[x].length; y++) {
			rows[x][y]++;
		}
	}

	// flash des poulpes avec 10 d'énergie
	while (containsFlashable()) {
		for (let x = 0; x < rows.length; x++) {
			for (let y = 0; y < rows[x].length; y++) {
				if (rows[x][y] > 9) flash(x, y);
			}
		}
	}

	// affichage
	for (let x = 0; x < rows.length; x++) {
		let debugLine = "";
		for (let y = 0; y < rows[x].length; y++) {
			if (rows[x][y] === 0) {
				debugLine += "O";
			} else debugLine += " ";
		}
		console.log(debugLine);
	}

}

function flash(x, y) {
	rows[x][y] = 0;

	increment(x+1, y+1);
	increment(x, y+1);
	increment(x-1, y+1);
	increment(x+1, y);
	increment(x-1, y);
	increment(x+1, y-1);
	increment(x, y-1);
	increment(x-1, y-1);
}

function increment(x, y) {
	if (rows[x] === undefined) return;
	if (rows[x][y] === undefined) return;

	if (rows[x][y] != 0) rows[x][y]++;
}

function containsFlashable() {
	for (let x = 0; x < rows.length; x++) {
		for (let y = 0; y < rows[x].length; y++) {
			if (rows[x][y] > 9) return true;
		}
	}
	return false;
}

function containsOnly0() {
	for (let x = 0; x < rows.length; x++) {
		for (let y = 0; y < rows[x].length; y++) {
			if (rows[x][y] != 0) return false;
		}
	}
	return true;
}