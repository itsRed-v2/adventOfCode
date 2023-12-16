import { input } from "../input.js";

console.log(input.split(',').map(hash).reduce((a, b) => a + b));

function hash(str: string) {
    let currentValue = 0;
    for (let i = 0; i < str.length; i++) {
        currentValue += str.charCodeAt(i);
        currentValue *= 17;
        currentValue %= 256;
    }
    return currentValue;
}