import { INPUT } from '../input.js'

const ranges = INPUT.split(",").map(str => str.split("-").map(nb => parseInt(nb)));

console.log(ranges);
console.log(ranges.reduce((accumulator, range) => accumulator + range[1] - range[0] + 1, 0))

let totalInvalids = 0;

for (const range of ranges) {
    for (let i = range[0]; i <= range[1]; i++) {
        if (isInvalid(i)) {
            totalInvalids += i;
        }
    }
}

console.log("Sum of all invalid ids:", totalInvalids);

function isInvalid(id) {
    const strId = id.toString();

    for (let i = 1; i <= strId.length / 2; i++) {
        // the string length needs to be a multiple of the pattern length
        if (strId.length % i !== 0) continue;

        const pattern = strId.slice(0, i);

        let isInvalid = true;
        for (let j = i; j + i <= strId.length; j += i) {
            if (strId.slice(j, j+i) !== pattern) {
                isInvalid = false;
                break;
            }
        }
        if (isInvalid) return true;
    }
    return false;
}
