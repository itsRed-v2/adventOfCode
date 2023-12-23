type Axis = 'x' | 'y' | 'z';
const allAxes: Axis[] = ['x', 'y', 'z'];

class Vector {
    readonly x: number;
    readonly y: number;
	readonly z: number

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
		this.z = z;
    }

	down() {
		return new Vector(this.x, this.y, this.z - 1);
	}

	up() {
		return new Vector(this.x, this.y, this.z + 1);
	}
}

class Brick {
	start: Vector;
	end: Vector;
	readonly axis: Axis | undefined;
	readonly id: number;

	constructor(start: Vector, end: Vector, id: number) {
		this.start = start;
		this.end = end;
		this.id = id;

		if (start.x !== end.x) {
			this.axis = 'x';
		} else if (start.y !== end.y) {
			this.axis = 'y';
		} else if (start.z !== end.z) {
			this.axis = 'z';
		} else {
			this.axis = undefined;
		}
	}

	containsPos(pos: Vector) {
		for (const axis of allAxes) {
			if (axis !== this.axis && this.start[axis] !== pos[axis]) return false;
		}

		if (this.axis === undefined) return true;

		return pos[this.axis] >= this.start[this.axis] && pos[this.axis] <= this.end[this.axis];
	}

	* positionsIterator() {
		let { start, end } = this;
		for (let x = start.x; x <= end.x; x++) {
			for (let y = start.y; y <= end.y; y++) {
				for (let z = start.z; z <= end.z; z++) {
					yield new Vector(x, y, z);
				}
			}
		}
	}

	moveDown() {
		this.start = this.start.down();
		this.end = this.end.down();
	}
}

class World {
	bricks: Brick[];

	constructor(bricks: Brick[]) {
		this.bricks = bricks.sort((a, b) => a.end.z - b.end.z);
	}

	listBricksRelative(brick: Brick, position: 'up' | 'down') {
		let neighborBricks = new Set<Brick>();

		for (let pos of brick.positionsIterator()) {
			pos = (position === 'up') ? pos.up() : pos.down();
			const adjacentBrick = this.brickAt(pos);
			if (adjacentBrick !== undefined && adjacentBrick !== brick)
				neighborBricks.add(adjacentBrick);
		}

		return neighborBricks;
	}

	compressBricks() {
		for (const brick of this.bricks) {
			this.processFall(brick);
		}
	}

	private processFall(brick: Brick) {
		while (this.canFall(brick))
			brick.moveDown();
	}

	private canFall(brick: Brick): boolean {
		if (brick.start.z === 1) return false;

		const bricksBelow = this.listBricksRelative(brick, 'down');
		return bricksBelow.size === 0;
	}

	private brickAt(pos: Vector) {
		let lowestCandidateIndex = this.bricks.findIndex(brick => brick.end.z >= pos.z);
		return this.bricks.slice(lowestCandidateIndex).find(brick => brick.containsPos(pos));
	}

}

export {
	Vector,
	Brick,
	World
}