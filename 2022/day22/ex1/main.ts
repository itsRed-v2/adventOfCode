import { input } from "../input.js";

import { newSprite, Tile } from "./sprite.js";

let split = input.split("\n\n");

const map: Tile[][] = split[0].split("\n").map(line => {
	return line.split("").map(char => {
		if (char === ".") return "open";
		if (char === "#") return "wall";
		return undefined;
	});
});

const sprite = newSprite(map);

let path = split[1];
while (path.length > 0) {
	let match = path.match(/^(?:\d+|R|L)/);
	let symbol = match[0];
	path = path.substring(symbol.length);

	if (symbol === "R") {
		sprite.turnRight();
	} else if (symbol === "L") {
		sprite.turnLeft();
	} else {
		let moveAmount = parseInt(symbol);
		sprite.forward(moveAmount);
	}
}

let row = sprite.getPos().y + 1;
let column = sprite.getPos().x + 1;
let facing = sprite.getDirID();

const finalPassword = row * 1000 + column * 4 + facing;
console.log(finalPassword);