import { input } from "../input.js";

console.log(input.split("\n").map(line => {
	const pairs = line.split(",").map(range => range.split("-").map(strVal => parseInt(strVal)));
	return !(pairs[0][0] > pairs[1][1] || pairs[0][1] < pairs[1][0]);
}).reduce((accumulator, isOverlapping) => {
	return accumulator + (isOverlapping ? 1 : 0);
}));