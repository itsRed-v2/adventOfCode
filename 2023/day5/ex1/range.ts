class SingleRange {
    sourceStart: number;
    destStart: number;
    length: number;

    constructor(sourceStart: number, destStart: number, length: number) {
        this.sourceStart = sourceStart;
        this.destStart = destStart;
        this.length = length;
    }

    isInSource(value: number) {
        return value >= this.sourceStart && value < (this.sourceStart + this.length);
    }

    convert(value: number) {
        if (!this.isInSource(value)) return undefined;
        let offset = value - this.sourceStart;
        return this.destStart + offset;
    }
}

class RangeMap {
    ranges: SingleRange[];

    constructor(ranges: SingleRange[]) {
        this.ranges = ranges;
    }

    convert(value: number) {
        let result: number | undefined = undefined;
        for (let i = 0; i < this.ranges.length; i++) {
            result = this.ranges[i].convert(value);
            if (result) return result;
        }
        return value;
    }
}

export {
    SingleRange,
    RangeMap
}