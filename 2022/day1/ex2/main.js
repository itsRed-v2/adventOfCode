import { input } from "../input.js";

console.log(input.split("\n\n").map(elve => elve.split("\n").reduce((accumulator, val) => accumulator + parseInt(val), 0)).sort((a, b) => b - a).slice(0, 3).reduce((accumulator, val) => accumulator + val));

// console.log(input.split("\n\n")
// 	.map(elve => elve.split("\n").reduce((accumulator, val) => accumulator + parseInt(val), 0))
// 	.sort((a, b) => b - a)
// 	.slice(0, 3)
// 	.reduce((accumulator, val) => accumulator + val));