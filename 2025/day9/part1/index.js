import { INPUT } from './input.js'

const redTiles = INPUT.split("\n").map(line => ({
    x: parseInt(line.split(",")[0]),
    y: parseInt(line.split(",")[1])
}));

let largestArea = 0;

for (let i = 0; i < redTiles.length - 1; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
        const tile1 = redTiles[i];
        const tile2 = redTiles[j];
        const rectArea = Math.abs(tile1.x - tile2.x + 1) * Math.abs(tile1.y - tile2.y + 1);
        largestArea = Math.max(largestArea, rectArea);
    }
}

console.log(largestArea);
