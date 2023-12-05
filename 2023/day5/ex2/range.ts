class SeedRange {
    firstSeed: number;
    length: number;

    constructor(firstSeed: number, length: number) {
        this.firstSeed = firstSeed;
        this.length = length;
    }

    shift(from: number, to: number) {
        this.firstSeed += to - from;
    }
}

class SingleRange {
    sourceStart: number;
    destStart: number;
    length: number;

    constructor(sourceStart: number, destStart: number, length: number) {
        this.sourceStart = sourceStart;
        this.destStart = destStart;
        this.length = length;
    }

    convert(seeds: SeedRange) {
        let lastSeed = seeds.firstSeed + seeds.length - 1;
        let sourceEnd = this.sourceStart + this.length - 1;

        let newFirstSeed = Math.max(seeds.firstSeed, this.sourceStart);
        let newLastSeed = Math.min(lastSeed, sourceEnd);

        let newLength = newLastSeed - newFirstSeed + 1;
        if (newLength <= 0) return undefined;

        let truncatedRange = new SeedRange(newFirstSeed, newLength);
        truncatedRange.shift(this.sourceStart, this.destStart);
        return truncatedRange;
    }
}

function createPassiveRange(start: number, endInclusive: number) {
    let length = endInclusive - start + 1 
    return new SingleRange(start, start, length)
}

class RangeMap {
    ranges: SingleRange[];

    constructor(ranges: SingleRange[]) {
        this.ranges = ranges;
    }

    convert(seeds: SeedRange) {
        let result: SeedRange[] = [];
        for (let i = 0; i < this.ranges.length; i++) {
            let convertedRange = this.ranges[i].convert(seeds);
            if (convertedRange) result.push(convertedRange);
        }
        return result;
    }

    sort() {
        this.ranges.sort((a, b) => a.sourceStart - b.sourceStart);
    }

    fillFreeRanges() {
        this.sort();
        let fillingRanges: SingleRange[] = [];

        let startIndex = 0;
        for (const range of this.ranges) {
            let endIndex = range.sourceStart - 1;
            let length = endIndex - startIndex + 1;
            if (length > 0)
                fillingRanges.push(createPassiveRange(startIndex, endIndex));
            
            startIndex = range.sourceStart + range.length;
        }
        fillingRanges.push(createPassiveRange(startIndex, Infinity));

        this.ranges.push(...fillingRanges);
        this.sort();
    }
}

export {
    SeedRange,
    SingleRange,
    RangeMap
}