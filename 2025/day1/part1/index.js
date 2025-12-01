import { INPUT } from '../input.js';

const instructions = INPUT.split("\n")
    .map(line => [line[0], parseInt(line.slice(1))])

let dial = 50;
let zeroCount = 0;

for (const [direction, distance] of instructions) {
    if (direction == "R")
        dial += distance;
    else
        dial -= distance;

    dial %= 100
    if (dial < 0)
        dial += 100

    if (dial == 0)
        zeroCount++;
}

console.log("The dial was on zero", zeroCount, "times.");
