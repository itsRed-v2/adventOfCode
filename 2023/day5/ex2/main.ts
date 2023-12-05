import { input } from "../input.js";
import { SeedRange, SingleRange, RangeMap } from "./range.js";

const lineGroups = input.split('\n\n');
const firstLine = lineGroups.shift();
if (!firstLine) throw new Error("No groups detected.");

let seedRanges = parseSeeds(firstLine);
const maps = parseMaps(lineGroups);

console.log("Seeds:", seedRanges);

for (const map of maps) {
    let newSeedRanges: SeedRange[] = [];
    for (const seeds of seedRanges) {
        newSeedRanges.push(...map.convert(seeds));
    }
    seedRanges = newSeedRanges;
}

seedRanges.sort((a, b) => a.firstSeed - b.firstSeed);
console.log("Lowest location number:", seedRanges[0].firstSeed);

// functions

function parseSeeds(firstLine: string) {
    const seedRanges: SeedRange[] = [];

    const values = firstLine.split(': ')[1].split(' ').map(str => parseInt(str));
    for (let i = 0; i < values.length; i += 2) {
        seedRanges.push(new SeedRange(values[i], values[i + 1]))
    }

    return seedRanges;
}

function parseMaps(lineGroups: string[]) {
    return lineGroups.map(lineGroup => {
        const lines = lineGroup.split('\n');
        lines.shift();
    
        const ranges = lines.map(line => {
            let [dest, source, length] = line.split(' ').map(str => parseInt(str));
            return new SingleRange(source, dest, length);
        });
    
        const map = new RangeMap(ranges);
        map.fillFreeRanges();
        return map;
    });
}