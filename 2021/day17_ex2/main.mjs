import { input } from "../day17_ex1/input.mjs";

let maxYVelocity = Math.abs(input.yMin) - 1;
let minYVelocity = input.yMin;

let maxXVelocity = input.xMax;
let minXVelocity = 0;

let possibleVelocities = 0;

for (let Vx = minXVelocity; Vx <= maxXVelocity; Vx++) {
    for (let Vy = minYVelocity; Vy <= maxYVelocity; Vy++) {
        if (reachesTarget(Vx, Vy)) possibleVelocities++;
    }
}

console.log(possibleVelocities);

function reachesTarget(Vx, Vy) {
    let posX = 0;
    let posY = 0;

    while (posX <= input.xMax && posY >= input.yMin) {
        posX += Vx;
        posY += Vy;

        if (posX <= input.xMax && posX >= input.xMin
                && posY <= input.yMax && posY >= input.yMin)
            return true;

        if (Vx > 0) Vx--;
        Vy--;
    }

    return false;
}