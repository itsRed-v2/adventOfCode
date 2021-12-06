import { input } from "./input.mjs";

let fishes = input.split(",").map(string => parseInt(string));

console.log(fishes.length);

for (let i = 0; i < 80; i++) {
	let newFishes = 0;
	fishes = fishes.map(int => {
		if (int < 1) {
			int = 6;
			newFishes++;
		} else int--;
		return int;
	});

	for (let f = 0; f < newFishes; f++) {
		fishes.push(8);
	}
}

console.log(fishes.length);