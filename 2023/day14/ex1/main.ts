import { input } from "../input.js";

type Rock = '.' | 'O' | '#';

let world: Rock[][] = input.split('\n').map(line => line.split('') as Rock[]);

while (tiltNorth());

drawWorld();
console.log("Load:", calculateLoad());

function calculateLoad() {
    let totalLoad = 0;

    for (const [x, y] of Iterator2D(world)) {
        if (world[y][x] === 'O') {
            const load = world.length - y;
            totalLoad += load;
        }
    }

    return totalLoad;
}

function tiltNorth() {
    let hasEffect = false;

    for (const [x, y] of Iterator2D(world)) {
        if (world[y][x] === "O") {
            let hasRolled = rollBoulderNorth(x, y);
            if (hasRolled) hasEffect = true;
        }
    }

    return hasEffect;
}

function rollBoulderNorth(boulderX: number, boulderY: number) {
    if (boulderY === 0) return false;
    let target = world[boulderY - 1][boulderX];
    if (target !== ".") return false;

    let boulder = world[boulderY][boulderX];
    world[boulderY][boulderX] = '.';
    world[boulderY - 1][boulderX] = boulder;
    return true;
}

function drawWorld() {
    console.log(world.map(row => row.join('')).join('\n'));
}

function * Iterator2D(list: any[][]) {
    for (let y = 0; y < list.length; y++) {
        for (let x = 0; x < list[y].length; x++) {
            yield [x, y];
        }
    }
}