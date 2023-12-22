class Vector {
	readonly x: number;
	readonly y: number;

	static readonly directions = [
		new Vector(0, 1),
		new Vector(0, -1),
		new Vector(1, 0),
		new Vector(-1, 0),
	];

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(other: Vector) {
		return new Vector(this.x + other.x, this.y + other.y);
	}

	equals(other: Vector) {
		return this.x === other.x && this.y === other.y;
	}
}

class PathNode {
	readonly position: Vector
	readonly parent: PathNode | undefined;
	steps: number;

	constructor(position: Vector, parent: PathNode | undefined) {
		this.position = position;
		this.parent = parent;
		this.steps = parent ? parent.steps + 1 : 0;
	}

	getNeighbors() {
		return Vector.directions.map(vec => new PathNode(this.position.add(vec), this));
	}

	equals(other: PathNode) {
		return this.position.equals(other.position);
	}
}

class NodeSet {
	nodes: PathNode[] = [];

	add(node: PathNode) {
		if (!this.has(node)) {
			this.nodes.push(node);
		}
	}

	has(node: PathNode) {
		return this.nodes.some(n => n.equals(node));
	}
}

export {
	Vector,
	PathNode,
	NodeSet,
}