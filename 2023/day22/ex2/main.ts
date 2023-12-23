import { input } from "../input.js";
import { Brick, Vector, World } from "./brick.js";

const bricks = input.split('\n').map((line, index) => {
	const [_match, x1, y1, z1, x2, y2, z2] = line.match(/(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/) as RegExpMatchArray;
	const start = new Vector(parseInt(x1), parseInt(y1), parseInt(z1));
	const end = new Vector(parseInt(x2), parseInt(y2), parseInt(z2));
	return new Brick(start, end, index);
});

const world = new World(bricks);
world.compressBricks();
console.log("Bricks are compressed.");

let fallingCount = 0;
world.bricks.forEach((brick, index) => {
	const fallenBrickCount = disintegrateAndCountFalling(brick, world);
	console.log("Removed brick", index + 1, "/", world.bricks.length, ";  ", fallenBrickCount, "bricks fell.");
	fallingCount += fallenBrickCount;
});
console.log("Result:", fallingCount);

// Functions

function disintegrateAndCountFalling(brick: Brick, world: World): number {
	const brickIndex = world.bricks.indexOf(brick);
	world = world.clone();
	world.bricks.splice(brickIndex, 1);
	const fallenBrickCount = world.compressBricks();
	return fallenBrickCount;
}