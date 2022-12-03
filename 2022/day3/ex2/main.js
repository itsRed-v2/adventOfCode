import { input } from "../input.js";

const priorities = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const rucksacks = input.split("\n").map(line => line.split(""));
const groups = [];
for (let i = 0; i < rucksacks.length; i += 3) {
	groups.push(rucksacks.slice(i, i+3));
}

const groupBadges = groups.map(group => {
	let possibleTypes = group[0].filter(type => {
		return group[1].some(type2 => type2 === type) && group[2].some(type3 => type3 === type);
	});
	return possibleTypes[0];
});

const totalPriority = groupBadges.map(badge => {
	return priorities.indexOf(badge) + 1;
}).reduce((a, v) => a + v);

console.log(totalPriority);