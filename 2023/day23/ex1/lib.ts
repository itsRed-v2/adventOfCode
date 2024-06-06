type Tile = "." | "#" | ">" | "v";

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
}

type HeuristicFunction = (pos: Vector) => number;

class PathNode {
    readonly position: Vector;
    readonly symbol: Tile;
    readonly gcost: number;
    readonly hcost: number;
    readonly parent: PathNode | undefined;

    readonly heuristic: HeuristicFunction;
    readonly world: Tile[][];

    constructor(
        position: Vector,
        parent: PathNode | undefined,
        heurisctic: HeuristicFunction,
        world: Tile[][],
    ) {
        this.position = position;
        this.symbol = world[position.y][position.x];
        this.parent = parent;
        this.gcost = parent ? parent.gcost + 1 : 0;
        this.hcost = heurisctic(position);

        this.heuristic = heurisctic;
        this.world = world;

        if (!".>v".includes(this.symbol))
            throw new Error("Invalid symbol: " + this.symbol);
    }

    getNeighbors() {
        return this.neighborPos()
            .filter((pos) => this.inWorld(pos))
            .filter((pos) => this.world[pos.y][pos.x] !== "#")
            .map((pos) => new PathNode(pos, this, this.heuristic, this.world));
    }

    private neighborPos() {
        if (this.symbol === ">") return [this.position.add(Vector.EAST)];
        else if (this.symbol === "v") return [this.position.add(Vector.SOUTH)];
        else return Vector.directions.map((dir) => this.position.add(dir));
    }

    private inWorld(pos: Vector) {
        return (
            pos.x >= 0 &&
            pos.x < this.world[0].length &&
            pos.y >= 0 &&
            pos.y < this.world.length
        );
    }
}

class NodeSet {
    nodes: PathNode[] = [];

    insert(node: PathNode) {
        const previous = this.getNodeAt(node.position);
        if (!previous) {
            this.nodes.push(node);
        } else if (compareNodes(node, previous) > 0) {
            this.nodes[this.nodes.indexOf(previous)] = node;
        }
    }

    containsPos(pos: Vector) {
        return this.nodes.some((node) => node.position.equals(pos));
    }

    getNodeAt(pos: Vector) {
        for (const n of this.nodes) {
            if (n.position.equals(pos)) {
                return n;
            }
        }
    }

    getWorstNode() {
        this.nodes.sort(compareNodes);
        return this.nodes.pop();
    }

    size() {
        return this.nodes.length;
    }

    removeNode(node: PathNode) {
        this.nodes.splice(this.nodes.indexOf(node), 1);
    }
}

function compareNodes(a: PathNode, b: PathNode) {
    const heuristicDiff = a.hcost - b.hcost;
    if (heuristicDiff !== 0) return heuristicDiff;
    return a.gcost - b.gcost;
}

export { Tile, Vector, PathNode, NodeSet, compareNodes };
