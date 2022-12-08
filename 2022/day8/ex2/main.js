import { input } from "../input.js";

const grid = input.split("\n").map(line => line.split("").map(digit => parseInt(digit)));

const directions = [
	newVec(0, 1),
	newVec(0, -1),
	newVec(1, 0),
	newVec(-1, 0)
];

const scenicScoresGrid = grid.map((row, currentY) => row.map((treeHeight, currentX) => {
	const viewDistances = directions.map(dir => {
		let pos = newVec(currentX, currentY);

		let distance = 0;
		while (true) {
			pos.add(dir);
			if (pos.isOutOfGrid()) return distance;
			distance++;
			if (grid[pos.y][pos.x] >= treeHeight) return distance;
		}
	});

	return viewDistances.reduce((totalScore, currentScore) => totalScore * currentScore);
}));

let highestScenicScore = 0;
for (const row of scenicScoresGrid) {
	for (const score of row) {
		if (score > highestScenicScore) highestScenicScore = score;
	}
}

console.log(highestScenicScore);

// objects

function newVec(x, y) {
	return Object.freeze({
		get x() { return x },
		get y() { return y },
		add,
		isOutOfGrid
	});

	function add(otherVec) {
		x += otherVec.x;
		y += otherVec.y
	}

	function isOutOfGrid() {
		return x < 0 || x >= grid[0].length || y < 0 || y >= grid.length;
	}
}