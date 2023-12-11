import { input } from "../input.js";

type Pair<T> = [T, T];
type Vector = [number, number];

let INNER_WIDTH = input.indexOf("\n");
let OUTER_WIDTH = INNER_WIDTH + 1;

let world = input.split('\n');

// console.log("base world:");
// console.log(world.join('\n'));

// expanding universe

for (let x = 0; x < INNER_WIDTH; x++) {
    if (isEmptyColumn(x)) {
        addColumn(x);
        x++;
    }
}
for (let y = 0; y < world.length; y++) {
    if (isEmptyRow(y)) {
        addRow(y);
        y++;
    }
}

// console.log("expanded world:");
// console.log(world.join('\n'));

// indexing galaxies

const regexp = /#/g;
const galaxies: Vector[] = [];
let match;
while (match = regexp.exec(world.join('\n'))) {
    let matchIndex = match.index;
    let x = matchIndex % OUTER_WIDTH;
    let y = Math.floor(matchIndex / OUTER_WIDTH);
    galaxies.push([x, y]);
}

// console.log(galaxies);

let distanceSum = 0;
for (const pair of pairIterator(galaxies)) {
    const g1 = pair[0];
    const g2 = pair[1];
    let distance = Math.abs(g1[0] - g2[0]) + Math.abs(g1[1] - g2[1]);
    distanceSum += distance;
}

console.log(distanceSum);

// ### FUNCTIONS ###

function addColumn(index: number) {
    for (let i = 0; i < world.length; i++) {
        world[i] = world[i].slice(0, index) + "." + world[i].slice(index);
    }
    INNER_WIDTH++;
    OUTER_WIDTH++;
}

function addRow(index: number) {
    let newRow = ".".repeat(INNER_WIDTH);
    world.splice(index, 0, newRow);
}

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