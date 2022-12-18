export function newVector(x, y, z) {
	return Object.freeze({
		get x() { return x },
		get y() { return y },
		get z() { return z },
		getNeighbors,
		equals
	});

	function getNeighbors() {
		return [
			newVector(x + 1, y, z),
			newVector(x - 1, y, z),
			newVector(x, y + 1, z),
			newVector(x, y - 1, z),
			newVector(x, y, z + 1),
			newVector(x, y, z - 1),
		];
	}

	function equals(vec) {
		return x === vec.x && y === vec.y && z === vec.z;
	}
}

export function newMutableVector(x, y, z) {
	return {
		x, y, z
	}
}