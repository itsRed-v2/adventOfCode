import { input } from "../input.js";
import { RangeMap, SingleRange } from "./range.js";

const groups = input.split('\n\n');

const firstLine = groups.shift();
if (!firstLine) throw new Error("No groups detected.");

const seeds = firstLine.split(': ')[1].split(' ').map(str => parseInt(str));

const maps = groups.map(stringMap => {
    const lines = stringMap.split('\n')
    const ranges = lines.map(line => {
        let [dest, source, length] = line.split(' ').map(str => parseInt(str));
        return new SingleRange(source, dest, length);
    });
    return new RangeMap(ranges);
});

const results = seeds.map(seed => {
    let current = seed;
    for (const map of maps) {
        current = map.convert(current);
    }
    return current;
});

console.log(Math.min(...results));