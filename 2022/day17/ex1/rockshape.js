import { newVector } from "./vector.js";

function newRock(points) {
	return Object.freeze({
		points,
		getMin,
		getMax,
		shift,
		clone
	});

	function shift(vec) {
		points.forEach(p => p.add(vec));
	}

	function getMin() {
		let minX = Infinity, minY = Infinity;
		points.forEach(p => {
			if (p.x < minX) minX = p.x;
			if (p.y < minY) minY = p.y;
		});
		return newVector(minX, minY);
	}

	function getMax() {
		let maxX = 0, maxY = 0;
		points.forEach(p => {
			if (p.x > maxX) maxX = p.x;
			if (p.y > maxY) maxY = p.y;
		});
		return newVector(maxX, maxY);
	}

	function clone() {
		let newPoints = points.map(p => p.clone());
		return newRock(newPoints);
	}

}

export const rockList = [
	newRock([ // - shape
		newVector(0, 0),
		newVector(1, 0),
		newVector(2, 0),
		newVector(3, 0),
	]),
	newRock([ // + shape
		newVector(1, 2),
		newVector(0, 1),
		newVector(1, 1),
		newVector(2, 1),
		newVector(1, 0),
	]),
	newRock([ // reverse L shape
		newVector(2, 2),
		newVector(2, 1),
		newVector(0, 0),
		newVector(1, 0),
		newVector(2, 0),
	]),
	newRock([ // I shape
		newVector(0, 3),
		newVector(0, 2),
		newVector(0, 1),
		newVector(0, 0),
	]),
	newRock([ // square shape
		newVector(0, 1),
		newVector(1, 1),
		newVector(0, 0),
		newVector(1, 0),
	]),
]