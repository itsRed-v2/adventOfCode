import { input } from "../input.js";
import { Tile, Beam } from "./lib.js";

const HEIGHT = input.split('\n').length;
const WIDTH = input.indexOf('\n');

const leftSide = new Array(HEIGHT).fill(0).map((_item, i) => new Beam(-1, i, 'right'));
const rightSide = new Array(HEIGHT).fill(0).map((_item, i) => new Beam(WIDTH, i, 'left'));
const topSide = new Array(HEIGHT).fill(0).map((_item, i) => new Beam(i, -1, 'down'));
const bottomSide = new Array(HEIGHT).fill(0).map((_item, i) => new Beam(i, HEIGHT, 'up'));

const startingBeams = [...leftSide, ...rightSide, ...topSide, ...bottomSide];

const energyValues = startingBeams.map(beam => calculateEnergizedTiles(beam, input));
console.log(Math.max(...energyValues));

// Functions

function calculateEnergizedTiles(beam: Beam, strWorld: string) {
	const world = strWorld.split('\n').map(line => line.split('').map(char => new Tile(char)));
	const beams = [beam];

	while (beams.length !== 0) {
		const beam = beams[0];
		const previoustile = tileAt(beam);
		if (previoustile) previoustile.addBeam(beam.direction);
	
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
		}
	}
	
	let energizedCount = 0;
	for (let y = 0; y < world.length; y++) {
		for (let x = 0; x < world[y].length; x++) {
			if (world[y][x].isEnergized()) energizedCount++;
		}
	}
	return energizedCount;

	function tileAt(beam: Beam) {
		if (beam.y < 0 || beam.y >= world.length) return undefined;
		return world[beam.y][beam.x];
	}
}
