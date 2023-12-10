import { CrossNode, NodeSet, Pipe } from "./node.js";
import { Vector } from "./vector.js";

function drawWorld(
    worldWidth: number,
    worldHeight: number,
    pipeNodes: NodeSet<Pipe>
) {
    console.log(`\x1b[2J\x1b[0;0H`);

    const canvas = [];
    for (let y = 0; y < worldHeight; y++) {
        let line = "";
        for (let x = 0; x < worldWidth; x++) {
            if (pipeNodes.containsPos(new Vector(x, y))) {
                line += "*"
            } else {
                line += "."
            }
        }
        canvas.push(line);
    }

    console.log(canvas.join('\n'));
}

function drawCrossWorld(
    crossWorldHeight: number, 
    crossWorldWidth: number, 
    openCrossNodes: NodeSet<CrossNode>, 
    closedCrossNodes: NodeSet<CrossNode>
) {
    console.log(`\x1b[2J\x1b[0;0H`);

    const canvas = [];
    for (let y = 0; y < crossWorldHeight; y++) {
        let line = "";
        for (let x = 0; x < crossWorldWidth; x++) {
            const cursor = new Vector(x, y);
            if (closedCrossNodes.containsPos(cursor)) {
                line += "x"
            } else if (openCrossNodes.containsPos(cursor)) {
                line += "o"
            } else {
                line += "."
            }
        }
        canvas.push(line);
    }

    console.log(canvas.join('\n'));
}

export {
    drawWorld,
    drawCrossWorld
}