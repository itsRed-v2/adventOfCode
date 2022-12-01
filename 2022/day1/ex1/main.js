import { input } from "../input.js";

console.log(Math.max(...input.split("\n\n").map(elve => elve.split("\n").reduce((accumulator, val) => accumulator + parseInt(val), 0))));