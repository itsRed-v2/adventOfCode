import { INPUT } from '../input.js'

console.log("Largest total joltage:", INPUT.split("\n").map(line => {
    let largestFirstBattery = 0;
    let largestFirstBatteryIndex = 0;
    for (let i = 0; i < line.length - 1; i++) {
        let joltage = parseInt(line[i]);
        if (joltage > largestFirstBattery) {
            largestFirstBattery = joltage;
            largestFirstBatteryIndex = i;
        }
    }

    let largestSecondBattery = 0;
    for (let i = largestFirstBatteryIndex + 1; i < line.length; i++) {
        let joltage = parseInt(line[i]);
        if (joltage > largestSecondBattery) {
            largestSecondBattery = joltage;
        }
    }

    return largestSecondBattery + largestFirstBattery * 10;
}).reduce((accumulator, value) => accumulator + value));
