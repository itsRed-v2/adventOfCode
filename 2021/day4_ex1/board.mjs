export default class Board {
	constructor(rows) {
		this.rows = rows;
	}

	mark(number) {
		let posY;
		let posX;

		for (let y = 0; y < 5; y++) {
			let row = this.rows[y]
			for (let x = 0; x < 5; x++) {
				if (row[x] === number) {
					row[x] = true;
					posX = x;
					posY = y;
				}
			}
		}

		if (!posX) return false;

		let strike = 0;
		for (let x = 0; x < 5; x++) {
			if (this.rows[posY][x] === true) strike++;
		}
		if (strike === 5) return true;

		strike = 0;
		for (let y = 0; y < 5; y++) {
			if (this.rows[y][posX] === true) strike++;
		}
		if (strike === 5) return true;

		return false;
	}
}