import { INPUT } from "../input.js"

const rows = INPUT.split("\n");
const WORLD_WIDTH = rows[0].length;
let beams = new Array(WORLD_WIDTH).fill(0);
beams[rows[0].indexOf("S")] = 1

for (const row of rows) {
    for (let i = 0; i < WORLD_WIDTH; i++) {
        if (row[i] === "^") {
            beams[i + 1] += beams[i];
            beams[i - 1] += beams[i];
            beams[i] = 0;
        }
    }
}

console.log(Object.values(beams).reduce((a, b) => a + b));
