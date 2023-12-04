import { input } from "../input.js";

console.log(input.split('\n').map(cardStr => {
    const values = cardStr.split(': ')[1];
    let [winning, numbers] = values.split(' | ').map(valuesString => {
        return valuesString.split(' ').filter(str => str != '').map(str => parseInt(str));
    });

    let matches = 0;
    for (const n of numbers) {
        if (winning.includes(n)) matches++;
    }

    return matches == 0 ? 0 : 2 ** (matches - 1);
}).reduce((a, b) => a + b));