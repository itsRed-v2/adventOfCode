import { input } from "../input.js";
import { Brick, Vector, World } from "./brick.js";

const bricks = input.split('\n').map((line, index) => {
	const [_match, x1, y1, z1, x2, y2, z2] = line.match(/(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/) as RegExpMatchArray;
	const start = new Vector(parseInt(x1), parseInt(y1), parseInt(z1));
	const end = new Vector(parseInt(x2), parseInt(y2), parseInt(z2));
	return new Brick(start, end, index);
});

const world = new World(bricks);
console.log("Bricks are sorted.");
world.compressBricks();
console.log("Bricks are compressed.");

let safeBricks = 0;
for (const brick of world.bricks) {
	if (canBeDisintegrated(brick, world)) safeBricks++;
}
console.log(safeBricks, "bricks can be safely disintegrated.");

// Functions

function canBeDisintegrated(brick: Brick, world: World) {
	const bricksAbove = world.listBricksRelative(brick, 'up');
	return Array.from(bricksAbove).every(b => {
		return world.listBricksRelative(b, 'down').size >= 2;
	});
}