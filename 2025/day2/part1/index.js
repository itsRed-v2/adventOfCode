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
    const str = id.toString();
    const length = str.length;
    if (length % 2 === 1) return false;
    else if (str.slice(0, length / 2) === str.slice(length / 2)) {
        return true;
    }
}
