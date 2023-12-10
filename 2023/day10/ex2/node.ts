import { Vector, Direction, allDirections } from "./vector.js";

interface Node {
    position: Vector;
}

class NodeSet<Type extends Node> {
    nodes: Type[] = [];

    add(node: Type) {
        this.nodes.push(node);
    }

    containsPos(pos: Vector) {
        return this.nodes.some(node => node.position.equals(pos));
    }

    getNodeAt(pos: Vector) {
        for (const n of this.nodes) {
            if (n.position.equals(pos)) {
                return n;
            }
        }
    }

    flush() {
        const elements = [...this.nodes];
        this.nodes = [];
        return elements;
    }

    shift() {
        return this.nodes.shift();
    }

    isEmpty() {
        return this.nodes.length === 0;
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

class Pipe {
    position: Vector;
    directions: Direction[];
    symbol: string;

    constructor(position: Vector, symbol: string) {
        this.position = position;
        this.directions = pipes[symbol] ?? [];
        this.symbol = symbol;
    }

    getNeighborPositions() {
        return this.directions.map(dir => {
            return this.position.add(Vector.fromDirection(dir));
        });
    }
}

class CrossNode {
    position: Vector;

    constructor(position: Vector) {
        this.position = position;
    }

    getNeighbors() {
        return allDirections.map(dir => {
            return this.position.add(Vector.fromDirection(dir));
        });
    }
}

export {
    Pipe,
    NodeSet,
    CrossNode,
    pipes
}