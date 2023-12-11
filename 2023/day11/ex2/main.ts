import { input } from "../input.js";
import { Galaxy } from "./galaxy.js";

type Pair<T> = [T, T];

let INNER_WIDTH = input.indexOf("\n");
let OUTER_WIDTH = INNER_WIDTH + 1;

let world = input.split('\n');

// indexing galaxies

const regexp = /#/g;
const galaxies: Galaxy[] = [];
let match;
while (match = regexp.exec(world.join('\n'))) {
    let matchIndex = match.index;
    let x = matchIndex % OUTER_WIDTH;
    let y = Math.floor(matchIndex / OUTER_WIDTH);
    galaxies.push(new Galaxy(x, y));
}

// expanding universe

for (let x = 0; x < INNER_WIDTH; x++) {
    if (isEmptyColumn(x)) {
        galaxies.filter(g => g.x > x).forEach(g => g.columnsBefore++);
    }
}
for (let y = 0; y < world.length; y++) {
    if (isEmptyRow(y)) {
        galaxies.filter(g => g.y > y).forEach(g => g.rowsBefore++);
    }
}

galaxies.forEach(g => g.expand(1000000));

// console.log(galaxies);

let distanceSum = 0;
for (const pair of pairIterator(galaxies)) {
    const g1 = pair[0];
    const g2 = pair[1];
    let distance = Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y);
    distanceSum += distance;
}

console.log(distanceSum);

// ### FUNCTIONS ###

function isEmptyColumn(index: number) {
    for (let y = 0; y < world.length; y++) {
        if (world[y][index] === '#') return false;
    }
    return true;
}

function isEmptyRow(index: number) {
    return world[index] === ".".repeat(INNER_WIDTH);;
}

function * pairIterator<T>(list: T[]) {
    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            let pair: Pair<T> = [list[i], list[j]];
            yield pair;
        }
    }
}