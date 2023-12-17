import { input } from "../input.js";
import { Tile, Beam } from "./lib.js";

const world = input.split('\n').map(line => line.split('').map(char => new Tile(char)));
drawWorld();

const beams = [new Beam(-1, 0, 'right')];

while (beams.length !== 0) {
	const beam = beams[0];
	const oldTile = tileAt(beam);
	if (oldTile) {
		oldTile.addBeam(beam.direction);
		updateWorld(beam.x, beam.y);
	}

	beam.forward();
	const tile = tileAt(beam);
	if (!tile) {
		beams.shift();
		continue;
	}

	switch (tile.symbol) {
		case '/':
			beam.slashReflect();
			break;
		case '\\':
			beam.backSlashReflect();
			break;
		case '-':
			let newBeamHorizontal = beam.horizontalSplit();
			if (newBeamHorizontal) beams.push(newBeamHorizontal);
			break;
		case '|':
			let newBeamVertical = beam.verticalSplit();
			if (newBeamVertical) beams.push(newBeamVertical);
			break;
	}

	if (tile.isBeamAlreadyPresent(beam.direction)) {
		beams.shift();
		continue;
	}

	// Comment this line to get instant result
	await sleep(0);
}

let energizedCount = 0;
for (let y = 0; y < world.length; y++) {
	for (let x = 0; x < world[y].length; x++) {
		if (world[y][x].isEnergized()) energizedCount++;
	}
}
console.log(energizedCount);

// Function

function tileAt(beam: Beam) {
	if (beam.y < 0 || beam.y >= world.length) return undefined;
	return world[beam.y][beam.x];
}

function drawWorld() {
	let canvas = '';

	for (let y = 0; y < world.length; y++) {
		let line = '';
		for (let x = 0; x < world[y].length; x++) {
			const tile = world[y][x];
			if ('/\\-|'.includes(tile.symbol)) line += tile.symbol;
			else line += ' ';
		}
		canvas += line + '\n';
	}

	console.log(`\x1b[2J\x1b[0;0H${canvas}`);
}

function updateWorld(x: number, y: number) {
	let char;
	const tile = world[y][x];
	if ('/\\-|'.includes(tile.symbol)) char = tile.symbol;
	else char = tile.isEnergized() ? '*' : ' ';

	console.log(`\x1b[${y + 1};${x + 1}H${char}`);
	console.log(`\x1b[${world.length + 1};${1}H\x1b[Kbeams:`, beams.length);
}

function sleep(millis: number) {
	return new Promise(res => setTimeout(res, millis));
}