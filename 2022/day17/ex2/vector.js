export function newVector(x, y) {
	return Object.freeze({
		get x() { return x },
		get y() { return y},
		add,
		clone,
		opposite
	});

	function add(vec) {
		x += vec.x;
		y += vec.y;
	}

	function clone() {
		return newVector(x, y);
	}

	function opposite() {
		return newVector(-x, -y);
	}

}