import { input } from "./input.mjs";

let Vy = Math.abs(input.yMin) - 1; // the y velocity the probe is launched with
let heightReached = (Vy * Vy + Vy) / 2;

console.log("highest y position rechable:", heightReached);