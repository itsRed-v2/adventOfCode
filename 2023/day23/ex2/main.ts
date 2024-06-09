import { input } from "../input.js";
import { findEdges } from "./graphParser.js";
import { findAllPathLengths } from "./graphSolver.js";
import { Tile } from "./lib.js";

// To use the example input, replace line 1 with:
// import { example as input } from "../input.js";

// Turn this on to see a pretty animation of how the program works !
// ONLY do it with the EXAMPLE INPUT though: with the actual input, it will mess your terminal and take years to complete.
const DEBUG = false;

const world = input.split("\n").map((line) => line.split("")) as Tile[][];

const edges = await findEdges(DEBUG, world);
console.log("Edges:");
edges.forEach(edge => console.log(edge.pos1, edge.pos2, "Length", edge.length));
console.log("Edge count:", edges.length);

console.log("Processing paths...");

const lengths = await findAllPathLengths(DEBUG, world, edges);
lengths.sort((a, b) => b - a);
console.log("Distances:", lengths);
console.log("Longest distance (exercise solution):", lengths[0]);
