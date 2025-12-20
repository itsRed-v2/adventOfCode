import { INPUT } from '../input.js'

// ===== Transposing the input text =====

const textData = INPUT.split("\n");

const transposedTextData = [];

for (let column = 0; column < textData[0].length; column++) {
    const columnText = [];

    for (let row = 0; row < textData.length; row++) {
        columnText.push(textData[row][column]);
    }

    transposedTextData.push(columnText.join(""));
}

// ==== splitting the transposed input text into problems =====

const problemsTexts = transposedTextData.join("\n").split(/\n *\n/)

// ===== Simply computing every problem =====

let grandTotal = 0;

for (const probText of problemsTexts) {
    const lines = probText.split("\n");
    const firstLine = lines[0];

    const operator = firstLine[firstLine.length - 1];

    // Initialize accumulator with first operand, then apply other operations one by one
    let accumulator = parseInt(firstLine.substring(0, firstLine.length - 1));

    for (let i = 1; i < lines.length; i++) {
        if (operator === "*")
            accumulator *= parseInt(lines[i]);
        else
            accumulator += parseInt(lines[i]);
    }

    grandTotal += accumulator;
}

console.log("Grand total of all operations:", grandTotal);

