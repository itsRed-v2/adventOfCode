import fs from 'node:fs';

import { INPUT } from '../input.js';

const nodeSet = new Set();
const connections = [];

INPUT.split("\n").forEach(line => {
    const [device, outputsText] = line.split(": ");
    const outputs = outputsText.split(" ");
    connections.push([device, outputs]);
    nodeSet.add(device);
    for (const node of outputs) {
        nodeSet.add(node);
    }
});

const nodes = Array.from(nodeSet);

let nodesTextLines = [];
nodesTextLines.push("Id,Label");

for (let i = 0; i < nodes.length; i++) {
    nodesTextLines.push(i.toString() + "," + nodes[i]);
}

fs.writeFileSync("nodes.csv", nodesTextLines.join("\n"));

let linksTextLines = [];
linksTextLines.push("Source,Target,Type,Id");

let linkId = 1;
for (let i = 0; i < connections.length; i++) {
    const [source, destinations] = connections[i];
    const sourceId = nodes.indexOf(source);

    for (const dest of destinations) {
        const destId = nodes.indexOf(dest);
        linksTextLines.push(`${sourceId},${destId},Directed,${linkId}`);
        linkId++;
    }
}

fs.writeFileSync("links.csv", linksTextLines.join("\n"));

console.log("Graph data has been saved to 'nodes.csv' and 'links.csv', ready to be imported in Gephi.")
