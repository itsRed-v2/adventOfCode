import { input } from "../input.js";

type Rock = '.' | 'O' | '#';
type World = Rock[][];

class Vector {
    readonly x: number;
    readonly y: number;

    static readonly NORTH = new Vector(0, -1);
    static readonly WEST = new Vector(-1, 0);
    static readonly SOUTH = new Vector(0, 1);
    static readonly EAST = new Vector(1, 0);

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const CYCLE_OBJECTIVE = 1000000000;

let world: World = input.split('\n').map(line => line.split('') as Rock[]);

let history: World[] = [];
history.push(worldSnapShot());

let cycleIndex = 0;

while (cycleIndex < CYCLE_OBJECTIVE) {
    spinCycle();
    cycleIndex++;
    console.log("iteration", cycleIndex);

    let index = indexInHistory(history, world);
    if (index !== -1) {
        console.log("Found repetition from", index, "to", cycleIndex);
        let repetitionPeriod = cycleIndex - index;
        console.log("period:", repetitionPeriod);
        console.log("cycleIndex before:", cycleIndex);
        cycleIndex = Math.floor((CYCLE_OBJECTIVE - cycleIndex) / repetitionPeriod) * repetitionPeriod + cycleIndex;
        console.log("cycleIndex after:", cycleIndex);
        break;
    }

    history.push(worldSnapShot());
}

while (cycleIndex < CYCLE_OBJECTIVE) {
    spinCycle();
    cycleIndex++;
    console.log("iteration", cycleIndex);
}
console.log(`Load after ${CYCLE_OBJECTIVE} cycles:`, calculateLoad());

// Functions

function indexInHistory(history: World[], world: World) {
    for (let i = 0; i < history.length; i++) {
        if (worldEquals(history[i], world)) {
            return i;
        }
    }
    return -1;
}

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

function spinCycle() {
    while (tilt(Vector.NORTH));
    while (tilt(Vector.WEST));
    while (tilt(Vector.SOUTH));
    while (tilt(Vector.EAST));
}

function tilt(direction: Vector) {
    let hasEffect = false;

    for (const [x, y] of Iterator2D(world)) {
        if (world[y][x] === "O") {
            let hasRolled = rollBoulder(new Vector(x, y), direction);
            if (hasRolled) hasEffect = true;
        }
    }

    return hasEffect;
}

function rollBoulder(boulder: Vector, direction: Vector) {
    let target = new Vector(boulder.x + direction.x, boulder.y + direction.y);
    if (target.y < 0 || target.y >= world.length || target.x < 0 || target.x >= world[0].length) return false;

    let targetType = world[target.y][target.x];
    if (targetType !== ".") return false;

    let boulderType = world[boulder.y][boulder.x];
    world[boulder.y][boulder.x] = '.';
    world[target.y][target.x] = boulderType;
    return true;
}

function drawWorld() {
    console.log(world.map(row => row.join('')).join('\n'));
}

function worldSnapShot() {
    return world.map(row => [...row]);
}

function worldEquals(w1: World, w2: World) {
    for (const [x, y] of Iterator2D(w1)) {
        if (w1[y][x] !== w2[y][x]) return false;
    }
    return true;
}

function * Iterator2D(list: any[][]) {
    for (let y = 0; y < list.length; y++) {
        for (let x = 0; x < list[y].length; x++) {
            yield [x, y];
        }
    }
}