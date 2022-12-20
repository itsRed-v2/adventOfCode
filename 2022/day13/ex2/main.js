import { input } from "../input.js";
const pairs = input.split("\n").filter(line => !(line === "")).map(line => eval(line));
const divider1 = [[2]];
const divider2 = [[6]];
pairs.push(divider1, divider2);
pairs.sort((a, b) => {
    let result = compare(a, b);
    if (result === true)
        return -1;
    if (result === false)
        return 1;
    return 0;
});
let index1 = pairs.indexOf(divider1) + 1;
let index2 = pairs.indexOf(divider2) + 1;
console.log(index1 * index2);
// functions
function compare(left, right) {
    if (typeof left === "number" && typeof right === "number") {
        return compareInt(left, right);
    }
    else if (Array.isArray(left) && Array.isArray(right)) {
        return compareArrays(left, right);
    }
    else {
        if (typeof left === "number")
            left = [left];
        if (typeof right === "number")
            right = [right];
        return compareArrays(left, right);
    }
}
function compareInt(left, right) {
    if (left === right)
        return undefined;
    return left < right;
}
function compareArrays(left, right) {
    for (let i = 0;; i++) {
        if (i >= left.length && i >= right.length)
            return undefined;
        if (i >= left.length)
            return true;
        if (i >= right.length)
            return false;
        let leftVal = left[i];
        let rightVal = right[i];
        let result = compare(leftVal, rightVal);
        if (result === false || result === true)
            return result;
    }
}
