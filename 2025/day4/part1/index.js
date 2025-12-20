import { INPUT } from '../input.js'

const world = INPUT.split("\n");

let accessibleRollCount = 0;

for (let y = 0; y < world.length; y++) {
    for (let x = 0; x < world[y].length; x++) {
        if (!hasRoll(x, y, world)) continue;

        let rollCount = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (hasRoll(x + dx, y + dy, world))
                    rollCount++;
            }
        }

        if (rollCount <= 4)
            accessibleRollCount++;
    }
}

console.log("Accessible rolls count:", accessibleRollCount);

function hasRoll(x, y, world) {
    if (y < 0 || y >= world.length || x < 0 || x >= world[y].length)
        return false;
    return world[y][x] === "@";
}
