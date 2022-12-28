export {
	newWorld,
	newVector,
	Vector
}

type Map = boolean[][];

function newWorld(input: string) {

	const initialBlizzards = [];

	let inputLines = input.split("\n");

	const sizeY = inputLines.length;
	const sizeX = inputLines[0].length;

	inputLines.forEach((line, y) => {
		line.split("").forEach((char, x) => {
			if (!"^v<>".includes(char)) return;
			let direction: Vector;
			if (char === "^") direction = newVector(0, -1);
			if (char === ">") direction = newVector(1, 0);
			if (char === "v") direction = newVector(0, 1);
			if (char === "<") direction = newVector(-1, 0);
			initialBlizzards.push(newBlizzard(newVector(x, y), direction));
		});
	});

	const maps: Map[] = [];

	return Object.freeze({
		sizeX,
		sizeY,
		isTraversableAt,
		isOutOfWorld
	});

	function isOutOfWorld(pos: Vector) {
		return pos.x < 0 || pos.x >= sizeX || pos.y < 0 || pos.y >= sizeY;
	}

	function isTraversableAt(pos: Vector, time: number) {
		let map = maps[time];
		if (!map) {
			map = createMapAtTime(time);
			maps[time] = map;
		}

		return map[pos.y][pos.x];
	}

	function createMapAtTime(time: number): Map {
		let map = new Array(sizeY).fill(undefined).map(_ => new Array(sizeX).fill(true));
		
		// placing blizzards
		for (const blizzard of initialBlizzards) {
			let pos = blizzardPosAfterTime(blizzard, time);
			map[pos.y][pos.x] = false;
		}

		// placing walls
		for (let x = 0; x < sizeX; x++) {
			map[0][x] = false;
			map[sizeY - 1][x] = false;
		}
		for (let y = 0; y < sizeY; y++) {
			map[y][0] = false;
			map[y][sizeX - 1] = false;
		}

		// start and end positions are accessible
		map[0][1] = true;
		map[sizeY - 1][sizeX - 2] = true;

		return map;

		function blizzardPosAfterTime(blizzard: Blizzard, time: number) {
			return blizzard.dir.multiply(time).add(blizzard.pos).add(newVector(-1, -1)).wrap(sizeX - 2, sizeY - 2).add(newVector(1, 1));
		}
	}

	function drawMap(map: Map) {
		console.log("=== MAP ===")
		for (const row of map) {
			let line = "";
			for (let x = 0; x < row.length; x++) {
				line += row[x] ? "." : "#";
			}
			console.log(line);
		}
	}

}

interface Blizzard {
	pos: Vector,
	dir: Vector
}

function newBlizzard(pos: Vector, dir: Vector) {
	return Object.freeze({
		pos,
		dir
	});
}

interface Vector {
	x: number,
	y: number,
	add: (vec: Vector) => Vector,
	wrap: (worldSizeX: number, worldSizeY: number) => Vector,
	multiply: (multiplier: number) => Vector,
	equals: (vec: Vector) => boolean
}

function newVector(x: number, y: number): Vector {
	return Object.freeze({
		x, y,
		add,
		wrap,
		multiply,
		equals
	});

	function add(vec: Vector) {
		return newVector(x + vec.x, y + vec.y);
	}

	function wrap(worldSizeX: number, worldSizeY: number) {
		let newX = x % worldSizeX;
		let newY = y % worldSizeY;
		if (newX < 0) newX += worldSizeX;
		if (newY < 0) newY += worldSizeY;
		return newVector(newX, newY);
	}

	function multiply(multiplier: number) {
		return newVector(x * multiplier, y * multiplier);
	}

	function equals(vec: Vector) {
		return x === vec.x && y === vec.y;	
	}
}