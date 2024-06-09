import { drawLines } from "./graphParser.js";
import { Tile, Vector, sleep } from "./lib.js";

class GraphNode {
    position: Vector;
    parent: GraphNode | undefined;
    gcost: number;
    graph: Graph;

    constructor(graph: Graph, position: Vector, parent: GraphNode | undefined, distanceFromParent: number) {
        this.graph = graph;
        this.position = position;
        this.parent = parent;
        this.gcost = (parent ? parent.gcost : 0) + distanceFromParent;
    }

    getNeighbors() {
        const neighbors: GraphNode[] = [];
        for (const edge of this.graph) {
            if (edge.pos1.equals(this.position)) {
                neighbors.push(new GraphNode(this.graph, edge.pos2, this, edge.length));
            } else if (edge.pos2.equals(this.position)) {
                neighbors.push(new GraphNode(this.graph, edge.pos1, this, edge.length));
            }
        }
        return neighbors;
    }
}

interface Edge {
    pos1: Vector;
    pos2: Vector;
    length: number;
}

type Graph = Edge[];

async function findAllPathLengths(DEBUG: boolean, world: Tile[][], graph: Graph) {
    const startingNode = new GraphNode(graph, new Vector(1, 0), undefined, -1);
    const goalPos = new Vector(world[0].length - 2, world.length - 1);
    const closed: Vector[] = [];

    if (DEBUG)
        console.log("\n".repeat(world.length));

    return await explore(startingNode, closed);

    // Explorer recursive function

    async function explore(current: GraphNode, closed: Vector[]): Promise<number[]> {
        closed.push(current.position);

        if (DEBUG) {
            drawPath(world, current);
            await sleep(50);
        }

        if (current.position.equals(goalPos)) {
            return [current.gcost];
        }

        let result: number[] = [];
        for (const neighbor of current.getNeighbors()) {
            if (!isClosed(neighbor.position)) {
                result = result.concat(await explore(neighbor, [...closed]));
            }
        }
        return result;

        function isClosed(pos: Vector) {
            return closed.some(closedPosition => closedPosition.equals(pos))
        }
    }

}


function drawPath(world: Tile[][], node: GraphNode) {
    let current: GraphNode | undefined = node;
    const path: Vector[] = [];

    while (current) {
        path.push(current.position);
        current = current.parent;
    }

    const vectorPairs: [Vector, Vector][] = [];
    for (let i = 0; i < path.length - 1; i++) {
        vectorPairs.push([path[i], path[i + 1]]);
    }

    drawLines(world, vectorPairs);
}

export {
    Graph,
    Edge,
    GraphNode,
    findAllPathLengths
}
