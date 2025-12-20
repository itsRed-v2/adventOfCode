import { INPUT } from '../input.js'

console.log("Largest total joltage:", INPUT.split("\n").map(line => {

    let totalJoltage = "";
    let lastBatteryIndex = 0;
    for (let i = 0; i < 12; i++) {
        let maxJoltage = 0;
        let maxJoltageIndex = 0;
        for (let j = lastBatteryIndex; j <= line.length - 12 + i; j++) {
            if (parseInt(line[j]) > maxJoltage) {
                maxJoltage = parseInt(line[j]);
                maxJoltageIndex = j;
            }
        }
        totalJoltage += maxJoltage.toString();
        lastBatteryIndex = maxJoltageIndex + 1;
    }

    return parseInt(totalJoltage);
}).reduce((accumulator, value) => accumulator + value));
