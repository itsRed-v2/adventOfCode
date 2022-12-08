import { input } from "../input.js";

const grid = input.split("\n").map(line => line.split("").map(digit => parseInt(digit)));

const directions = [
	newVec(0, 1),
	newVec(0, -1),
	newVec(1, 0),
	newVec(-1, 0)
];

const visibleGrid = grid.map((row, currentY) => row.map((treeHeight, currentX) => {
	return directions.some(dir => {
		let pos = newVec(currentX, currentY);
		pos.add(dir);

		while (!pos.isOutOfGrid()) {
			if (grid[pos.y][pos.x] >= treeHeight) return false;
			pos.add(dir);
		}
		return true;
	});
}));

let visibleTreeCount = 0;
visibleGrid.forEach(row => row.forEach(visible => visible ? visibleTreeCount++ : 0));
console.log(visibleTreeCount);

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