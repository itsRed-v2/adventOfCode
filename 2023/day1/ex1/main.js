import { input } from "../input.js";

console.log(input.split('\n').map(line => {
    let firstDigit = '';
    let lastDigit = '';
    for (const char of line) {
        if (!char.match(/\d/)) continue;
        if (!firstDigit) firstDigit = char;
        lastDigit = char;
    }
    return parseInt(firstDigit + lastDigit);
}).reduce((a, b) => a + b));