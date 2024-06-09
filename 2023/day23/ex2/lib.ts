class Vector {
    x: number;
    y: number;

    static readonly NORTH = new Vector(0, -1);
    static readonly SOUTH = new Vector(0, 1);
    static readonly EAST = new Vector(1, 0);
    static readonly WEST = new Vector(-1, 0);

    static readonly directions = [
        Vector.NORTH,
        Vector.SOUTH,
        Vector.EAST,
        Vector.WEST,
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

    subtract(other: Vector) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    serialize() {
        return `x${this.x}y${this.y}`;
    }
}

class PathNode {
    readonly position: Vector;
    readonly symbol: Tile;
    readonly gcost: number;
    readonly parent: PathNode | undefined;

    readonly world: Tile[][];

    constructor(
        position: Vector,
        parent: PathNode | undefined,
        world: Tile[][],
    ) {
        this.position = position;
        this.symbol = world[position.y][position.x];
        this.parent = parent;
        this.gcost = parent ? parent.gcost + 1 : 0;

        this.world = world;

        if (!".>v".includes(this.symbol))
            throw new Error("Invalid symbol: " + this.symbol);
    }

    getNeighbors() {
        return this.neighborPos()
            .filter(pos => this.inWorld(pos))
            .filter(pos => this.world[pos.y][pos.x] !== "#")
            .map(pos => new PathNode(pos, this, this.world));
    }

    private neighborPos() {
        return Vector.directions.map((dir) => this.position.add(dir));
    }

    private inWorld(pos: Vector) {
        return (
            pos.x >= 0 &&
            pos.x < this.world[0].length &&
            pos.y >= 0 &&
            pos.y < this.world.length
        );
    }

    isAtCrossroad() {
        let accessibleNeighbors = Vector.directions.filter(dir => {
            const neighbor = this.position.add(dir);
            return this.world[neighbor.y]?.[neighbor.x] !== "#";
        });
        return accessibleNeighbors.length >= 3;
    }

    getPreviousCrossroad() {
        let current = this.parent;
        while (current?.parent && !current.isAtCrossroad()) {
            current = current.parent;
        }
        if (current?.position.equals(this.position)) return undefined;
        return current;
    }

    traceBridge() {
        const bridge: Vector[] = [];
        let current = this.parent;
        while (current && !current.isAtCrossroad()) {
            bridge.push(current.position);
            current = current.parent;
        }
        return bridge;
    }
}

class NodeList {
    nodes: PathNode[] = [];
    posMap: { [key: string]: Vector } = {};

    add(node: PathNode) {
        this.nodes.push(node);
        this.posMap[node.position.serialize()] = node.position;
    }

    containsPos(pos: Vector) {
        // return this.nodes.some((node) => node.position.equals(pos));
        return this.posMap[pos.serialize()] !== undefined;
    }

    clone() {
        const duplicate = new NodeList();
        duplicate.nodes = [...this.nodes];
        return duplicate;
    }

    isEmpty() {
        return this.nodes.length === 0;
    }

    pop() {
        return this.nodes.pop();
    }

    getNodes() {
        return [...this.nodes];
    }
}

function sleep(millis: number) {
    return new Promise(res => setTimeout(res, millis));
}

type Tile = "." | "#" | ">" | "v";
type NodePair = [PathNode, PathNode];
type Line = [Vector, Vector];

export { Tile, Vector, PathNode, NodeList, NodePair, Line, sleep };
