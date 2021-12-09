export default class Coordinates {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equals(coordinates) {
		return this.x == coordinates.x && this.y == coordinates.y;
	}
}