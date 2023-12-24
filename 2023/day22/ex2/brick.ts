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
	readonly start: Vector;
	readonly end: Vector;

	constructor(start: Vector, end: Vector) {
		this.start = start;
		this.end = end;
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

	movedDown() {
		return new Brick(this.start.down(), this.end.down());
	}
}

class World {
	private bricks: Brick[];
	private space: (Brick | undefined)[][][];

	constructor(bricks: Brick[]) {
		this.bricks = bricks;

		// Finding the boundaries of space
		const boundary = this.bricks.reduce((boundary, brick) => {
			return new Vector(
				Math.max(boundary.x, brick.end.x),
				Math.max(boundary.y, brick.end.y),
				Math.max(boundary.z, brick.end.z),
			);
		}, new Vector(0, 0, 0));

		// initialization of 3d empty array;
		this.space = new Array(boundary.x + 1).fill(0).map(e => {
			return new Array(boundary.y + 1).fill(0).map(e => {
				return new Array(boundary.z + 1);
			});
		});

		// Adding bricks to the array
		this.bricks.forEach(brick => this.addBrickToSpace(brick));
	}

	clone() {
		return new World(this.bricks.map(b => b));
	}

	removeBrick(brick: Brick) {
		this.removeBrickFromSpace(brick);
		this.bricks.splice(this.bricks.indexOf(brick), 1);
	}

	getBricks() {
		return [...this.bricks];
	}

	compressBricks() {
		this.bricks.sort((a, b) => a.start.z - b.start.z);
		let modifiedCount = this.bricks.reduce((modifiedCount, brick) => {
			return this.processFall(brick) ? modifiedCount + 1 : modifiedCount;
		}, 0);
		return modifiedCount;
	}

	private processFall(brick: Brick) {
		if (!this.canFall(brick)) return false;

		while (this.canFall(brick))
			brick = this.moveBrickDown(brick);
		return true;
	}

	private canFall(brick: Brick): boolean {
		if (brick.start.z === 1) return false;

		for (let pos of brick.positionsIterator()) {
			const adjacentBrick = this.brickAt(pos.down());
			if (adjacentBrick !== undefined && adjacentBrick !== brick)
				return false;
		}
		return true;
	}

	private moveBrickDown(brick: Brick) {
		this.removeBrickFromSpace(brick);
		const newBrick = brick.movedDown();
		this.bricks[this.bricks.indexOf(brick)] = newBrick;
		this.addBrickToSpace(newBrick);
		return newBrick;
	}

	private addBrickToSpace(brick: Brick) {
		for (const pos of brick.positionsIterator()) {
			this.space[pos.x][pos.y][pos.z] = brick;
		}
	}

	private removeBrickFromSpace(brick: Brick) {
		for (const pos of brick.positionsIterator()) {
			this.space[pos.x][pos.y][pos.z] = undefined;
		}
	}

	private brickAt(pos: Vector) {
		return this.space[pos.x][pos.y][pos.z];
	}

}

export {
	Vector,
	Brick,
	World
}