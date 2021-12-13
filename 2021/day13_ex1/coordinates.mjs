export default class Coordinates {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equals(coordinates) {
		return this.x == coordinates.x && this.y == coordinates.y;
	}

	flip(axis, position) {
		if (axis === "x") {
			if (position > this.x) return;
			this.x -= (this.x - position) * 2;
		}
		if (axis === "y") {
			if (position > this.y) return;
			this.y -= (this.y - position) * 2;
		}
	}
}