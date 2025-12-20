import { INPUT } from '../input.js'

const [rangesData, IDsData] = INPUT.split("\n\n");
const ranges = rangesData.split("\n").map(line => line.split("-").map(e => parseInt(e)))

const availableIDs = IDsData.split("\n").map(id => parseInt(id))

// console.log(ranges);
// console.log(availableIDs);

let freshCount = 0;

for (const id of availableIDs) {
    for (const range of ranges) {
        if (id >= range[0] && id <= range[1]) {
            freshCount++;
            break;
        }
    }
}

console.log("Fresh ingredient count:", freshCount);
