import { input } from "../input.js";

interface Lens {
    label: string;
    focalLength: number;
}

const boxes: Lens[][] = new Array(256).fill(0).map(() => new Array());

input.split(',').forEach(instruction => {
    const [_, label, operator, focalLength] = instruction.match(/^(.+)([-=])(\d*)$/) as RegExpMatchArray;
    const box = boxes[hash(label)];
    let previousLensIndex = box.findIndex(lens => lens.label === label);

    if (operator === '-') {
        if (previousLensIndex !== -1) box.splice(previousLensIndex, 1);
    } else if (operator === '=') {
        const newLens = {
            label,
            focalLength: parseInt(focalLength)
        };

        if (previousLensIndex === -1) {
            box.push(newLens);
        } else {
            box[previousLensIndex] = newLens;
        }

    } else throw new Error("Invalid instruction.");

});

boxes.forEach((box, index) => {
    if (box.length > 0) {
        console.log("Box", index, ":", box);
    }
});

const focusingPower = boxes.map((box, boxIndex) => {
    return box.map((lens, lensIndex) => {
        return lens.focalLength * (lensIndex + 1) * (boxIndex + 1);
    }).reduce((a, b) => a + b, 0);
}).reduce((a, b) => a + b);

console.log("Focusing power:", focusingPower);

// Functions

function hash(str: string) {
    let currentValue = 0;
    for (let i = 0; i < str.length; i++) {
        currentValue += str.charCodeAt(i);
        currentValue *= 17;
        currentValue %= 256;
    }
    return currentValue;
}