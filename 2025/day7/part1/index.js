import { INPUT } from "../input.js"

const rows = INPUT.split("\n");
let splits = 0;
let beams = new Set();
beams.add(rows[0].indexOf("S"))

for (const row of rows) {
    for (const beam of beams) {
        if (row[beam] === "^") {
            beams.delete(beam);
            beams.add(beam + 1);
            beams.add(beam - 1);
            splits++;
        }
    }
}

console.log(splits);

