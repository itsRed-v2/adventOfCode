import { input } from "../input.js";

const DIRECTIONS = {
	"U": newVec(0, 1),
	"R": newVec(1, 0),
	"L": newVec(-1, 0),
	"D": newVec(0, -1)
}

const visitedPlaces = [];

const instructions = input.split("\n").map(line => {
	const match = line.match(/^(.) (\d+)$/);
	return {
		direction: DIRECTIONS[match[1]],
		steps: parseInt(match[2])
	}
});

const HeadPos = newVec(0, 0);
const TailPos = newVec(0, 0);
addVisitedPlace(TailPos);

instructions.forEach((instruction, index) => {
	console.log(index + 1, "/", instructions.length);
	for (let i = 0; i < instruction.steps; i++) {
		HeadPos.add(instruction.direction);
		if (HeadPos.isTouching(TailPos)) continue;
	
		let tailMove = newVec(HeadPos.x - TailPos.x, HeadPos.y - TailPos.y);
		tailMove.maxTo1();
		TailPos.add(tailMove);
		addVisitedPlace(TailPos);
	}
});

console.log(visitedPlaces.length);

function addVisitedPlace(pos) {
	for (const place of visitedPlaces) {
		if (place.x === pos.x && place.y === pos.y) return;
	}
	visitedPlaces.push(pos.clone());
}

// vec objct

function newVec(x, y) {
	return Object.freeze({
		get x() { return x },
		get y() { return y },
		add,
		clone,
		isTouching,
		maxTo1
	});

	function add(otherVec) {
		x += otherVec.x;
		y += otherVec.y
	}

	function clone() {
		return newVec(x, y);
	}

	function isTouching(otherVec) {
		const distanceX = Math.abs(x - otherVec.x);
		const distanceY = Math.abs(y - otherVec.y);
		return distanceX <= 1 && distanceY <= 1;
	}

	function maxTo1() {
		if (x > 1) x = 1;
		if (x < -1) x = -1;
		if (y > 1) y = 1;
		if (y < -1) y = -1;
	}
}