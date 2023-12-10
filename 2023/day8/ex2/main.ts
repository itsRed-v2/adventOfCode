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

let largestPeriodIndex = indexOfLargest(periods);
while (!allEqual(values)) {
    values[largestPeriodIndex] += periods[largestPeriodIndex];

    for (let i = 0; i < periods.length; i++) {
        while (values[i] < values[largestPeriodIndex]) {
            values[i] += periods[i];
        }
    }
}

console.log(values[0]);

// Functions

function allEqual(list: number[]) {
    let value = list[0];
    return list.every(v => v === value);
}

function indexOfLargest(list: number[]) {
    let largest = 0;
    for (let i = 1; i < list.length; i++) {
        if (list[i] > list[largest]) largest = i;
    }
    return largest;
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