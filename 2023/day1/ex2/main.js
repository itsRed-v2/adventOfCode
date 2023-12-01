import { input } from "../input.js";

const digits = {
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9'
};

console.log(input.split('\n').map(processLine).reduce((a, b) => a + b));

function processLine(line) {
    const first = line.match(new RegExp(`(${Object.keys(digits).join('|')})`));
    const last = line.match(new RegExp(`.*(${Object.keys(digits).join('|')})`));
    return parseInt(digits[first[1]] + digits[last[1]]);
}