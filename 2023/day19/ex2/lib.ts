interface ComplexRule {
    key: 'x' | 'm' | 'a' | 's';
    operator: '<' | '>';
    value: number;
    destination: string;
}
type Rule = string | ComplexRule;

class PartRange {
    x: RatingRange;
    m: RatingRange;
    a: RatingRange;
    s: RatingRange;
    accepted: boolean | undefined;

    constructor(x: RatingRange, m: RatingRange, a: RatingRange, s: RatingRange) {
        this.x = x;
        this.m = m;
        this.a = a;
        this.s = s;
    }

    whereConditionTrue(rule: ComplexRule) {
        let key = rule.key;
        const passingParts = this.clone();
        passingParts[key] = this[key].splitOnconditionTrue(rule);
        return passingParts;
    }

    whereConditionFalse(rule: ComplexRule) {
        let key = rule.key;
        const passingParts = this.clone();
        passingParts[key] = this[key].splitOnconditionFalse(rule);
        return passingParts;
    }

    clone() {
        return new PartRange(this.x, this.m, this.a, this.s);
    }

    size() {
        return this.x.size() * this.m.size() * this.a.size() * this.s.size();
    }
}

class RatingRange {
    readonly lower: number;
    readonly upper: number;
    
    static readonly EMPTY_RANGE = new RatingRange(0, 0);

    constructor(lower: number, upper: number) {
        this.lower = lower;
        this.upper = upper;
    }

    splitOnconditionTrue(rule: ComplexRule) {
        let { operator, value } = rule;
        if (operator === '>') {
            if (value >= this.upper) return RatingRange.EMPTY_RANGE;
            if (value < this.lower) return this;
            return new RatingRange(value + 1, this.upper);
        } else {
            if (value <= this.lower) return RatingRange.EMPTY_RANGE;
            if (value > this.upper) return this;
            return new RatingRange(this.lower, value - 1);
        }
    }

    splitOnconditionFalse(rule: ComplexRule) {
        let { operator, value } = rule;
        if (operator === '>') {
            if (value >= this.upper) return this;
            if (value < this.lower) return RatingRange.EMPTY_RANGE;
            return new RatingRange(this.lower, value);
        } else {
            if (value <= this.lower) return this;
            if (value > this.upper) return RatingRange.EMPTY_RANGE;
            return new RatingRange(value, this.upper);
        }
    }

    size() {
        return this.upper - this.lower + 1;
    }
}

export {
    ComplexRule,
    Rule,
    PartRange,
    RatingRange,
}