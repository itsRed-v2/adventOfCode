import { input as input } from "../input.js";

type Tree = {
    [key: string]: [string, string];
};

const [instructions, treeLines] = input.split("\n\n");

const treeNodes: Tree = {};
for (const line of treeLines.split("\n")) {
  const [_match, key, v1, v2] = line.match(/^(...) = \((...), (...)\)$/) ?? [];
  treeNodes[key] = [v1, v2];
}

const startingNodes = Object.keys(treeNodes).filter(key => key.endsWith('A'));
const periods = startingNodes.map(node => getTravelDistance(node));
const values = [...periods];
console.log("Periods calculated.");

while (!allEqual(values)) {
    let i = getSmallest(values);
    values[i] += periods[i];
}

console.log(values[0]);

// Functions

function allEqual(list: number[]) {
    let value = list[0];
    return list.every(v => v === value);
}

function getSmallest(list: number[]) {
    let smallest = 0;
    for (let i = 1; i < list.length; i++) {
        if (list[smallest] > list[i]) smallest = i;
    }
    return smallest;
}

function getTravelDistance(node: string) {
    let currentNode = node;
    let i;
    for (i = 0; !currentNode.endsWith('Z'); i++) {
        let instruction = instructions[i % instructions.length];
        currentNode = treeNodes[currentNode][instruction === "L" ? 0 : 1];
    }
    return i;
}