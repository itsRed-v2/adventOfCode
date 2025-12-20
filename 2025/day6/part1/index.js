import { INPUT } from '../input.js'

const rows = INPUT.split("\n")
    .map(line => line.trim().split(/ +/))

// console.log(rows)

let grandTotal = 0;

for (let columnIndex = 0; columnIndex < rows[0].length; columnIndex++) {
    const operator = rows[rows.length - 1][columnIndex];

    let accumulator = parseInt(rows[0][columnIndex]);
    for (let rowIndex = 1; rowIndex < rows.length - 1; rowIndex++) {
        if (operator === "*")
            accumulator *= parseInt(rows[rowIndex][columnIndex]);
        else
            accumulator += parseInt(rows[rowIndex][columnIndex]);
    }

    grandTotal += accumulator;
}

console.log("Grand total of all operations:", grandTotal);

