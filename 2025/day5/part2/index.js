import { INPUT } from '../input.js'

const rangesData = INPUT.split("\n\n")[0];
const ranges = rangesData.split("\n")
        .map(line => line.split("-").map(e => parseInt(e)))
        .map(range => ({ start: range[0], end: range[1] }))

const initialRangeCount = ranges.length;

// console.log(ranges);

while (true) {
    let mergeSuccessful = false;
    for (let i = 0; i < ranges.length; i++) {
        for (let j = i + 1; j < ranges.length; j++) {
            if (mergeRanges(i, j, ranges)) {
                mergeSuccessful = true;
            }
        }
    }

    if (!mergeSuccessful) break;
}

// console.log("Merged ranges:");
// console.log(ranges);

let freshCount = 0;
for (const range of ranges) {
    freshCount += range.end - range.start + 1;
}

console.log("Compacted", initialRangeCount, "ranges into", ranges.length, "ranges.");
console.log("Total span of merged ranges:", freshCount);

// Functions

function mergeRanges(index1, index2, ranges) {
    const range1 = ranges[index1];
    const range2 = ranges[index2];

    if (range1.end < range2.start - 1 || range2.end < range1.start - 1)
        return false;

    range1.start = Math.min(range1.start, range2.start);
    range1.end = Math.max(range1.end, range2.end);

    ranges.splice(index2, 1);

    return true;
}
