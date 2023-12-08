import { input } from "../input.js";

const [instructions, treeLines] = input.split("\n\n");

const treeNodes: { [key: string]: string[]; } = {};

for (const line of treeLines.split("\n")) {
  const [_match, key, v1, v2] = line.match(/^(...) = \((...), (...)\)$/) ?? [];
  treeNodes[key] = [v1, v2];
}

let currentNode = "AAA";
let i;
for (i = 0; currentNode !== "ZZZ"; i++) {
  let instruction = instructions[i % instructions.length];
  currentNode = treeNodes[currentNode][instruction === "L" ? 0 : 1];
}

console.log(i);