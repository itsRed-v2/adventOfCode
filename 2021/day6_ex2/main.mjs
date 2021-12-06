import { input } from "../day6_ex1/input.mjs";

let fishAges = [];
for (let i = 0; i < 9; i++) fishAges.push(0);

for (const int of input.split(",").map(string => parseInt(string))) {
	fishAges[int]++;
}

for (let i = 0; i < 256; i++) {
	let newFishAges = [];
	for (let i = 0; i < 9; i++) newFishAges.push(0);

	for (let n = 0; n < 8; n++) {
		newFishAges[n] = fishAges[n + 1]
	}
	newFishAges[8] = fishAges[0];
	newFishAges[6] += fishAges[0];

	fishAges = newFishAges;
}

console.log(fishAges);

let totalFishes = 0;
for (const number of fishAges) totalFishes += number;

console.log(totalFishes);