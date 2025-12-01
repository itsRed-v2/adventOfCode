import { INPUT } from '../input.js';

const instructions = INPUT.split("\n")
    .map(line => [line[0], parseInt(line.slice(1))])

let dial = 50;
let zeroCount = 0;

for (const [direction, distance] of instructions) {
    if (direction == "R") {
        dial += distance;
        while (dial >= 100) {
            dial -= 100;
            zeroCount++;
        }
    }
    else {
        if (dial == 0) {
            // If the dial starts at zero before decreasing,
            // this zero must not be taken into account because
            // is was already counted at the previous iteration
            zeroCount--;
        }
        dial -= distance;
        while (dial < 0) {
            dial += 100;
            zeroCount++;
        }
        if (dial == 0) {
            // If we end right on zero there is no "overshoot" into the
            // negatives to we need to take it into account separately
            zeroCount++;
        }
    }
}

console.log("The dial went through zero", zeroCount, "times.");
