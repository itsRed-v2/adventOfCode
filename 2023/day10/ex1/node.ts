import { Vector, Direction } from "./vector.js";

class NodeSet {
    nodes: Node[] = [];

    add(node: Node) {
        this.nodes.push(node);
    }

    containsPos(pos: Vector) {
        return this.nodes.some(node => node.position.equals(pos));
    }

    flush() {
        const elements = [...this.nodes];
        this.nodes = [];
        return elements;
    }
}

const pipes: { [key: string]: Direction[] } = {
    "J": ["north", "west"],
    "L": ["north", "east"],
    "7": ["west", "south"],
    "F": ["east", "south"],
    "-": ["west", "east"],
    "|": ["north", "south"],
}

class Node {
    position: Vector;
    distance: number;
    directions: Direction[];

    constructor(position: Vector, parent: Node | undefined, symbol: string) {
        this.position = position;
        this.distance = parent ? parent.distance + 1 : 0;
        this.directions = pipes[symbol] ?? [];
    }

    getNeighborPositions() {
        return this.directions.map(dir => {
            return this.position.add(Vector.fromDirection(dir));
        });
    }
}

export {
    Node,
    NodeSet
}