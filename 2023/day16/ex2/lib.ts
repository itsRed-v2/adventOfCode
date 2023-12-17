type Direction = 'up' | 'down' | 'left' | 'right';

class Tile {
	symbol: string;
	beamDirections: Direction[] = [];

	constructor(symbol: string) {
		this.symbol = symbol;
	}

	isBeamAlreadyPresent(direction: Direction) {
		return this.beamDirections.includes(direction);
	}

	addBeam(direction: Direction) {
		if (this.isBeamAlreadyPresent(direction)) return;
		this.beamDirections.push(direction);
	}

	isEnergized() {
		return this.beamDirections.length !== 0;
	}
}

interface ReflectionMap {
	'up': Direction;
	'down': Direction;
	'left': Direction;
	'right': Direction;
}

class Beam {
	x: number;
	y: number;
	direction: Direction;

	static readonly slashReflectionMap: ReflectionMap = {
		'up': 'right',
		'down': 'left',
		'left': 'down',
		'right': 'up',
	}

	static readonly backSlashReflectionMap: ReflectionMap = {
		'up': 'left',
		'down': 'right',
		'left': 'up',
		'right': 'down',
	}

	constructor(x: number, y: number, direction: Direction) {
		this.x = x;
		this.y = y;
		this.direction = direction;
	}

	forward() {
		switch (this.direction) {
			case "up":
				this.y--;
				break;
			case "down":
				this.y++;
				break;
			case "left":
				this.x--;
				break;
			case "right":
				this.x++;
				break;
		}
	}

	verticalSplit() {
		if (this.direction === 'up' || this.direction === 'down') return undefined;

		this.direction = 'up';
		return new Beam(this.x, this.y, 'down');
	}

	horizontalSplit() {
		if (this.direction === 'right' || this.direction === 'left') return undefined;

		this.direction = 'right';
		return new Beam(this.x, this.y, 'left');
	}

	slashReflect() {
		this.direction = Beam.slashReflectionMap[this.direction];
	}

	backSlashReflect() {
		this.direction = Beam.backSlashReflectionMap[this.direction];
	}
}

export {
	Direction,
	Tile,
	Beam
}