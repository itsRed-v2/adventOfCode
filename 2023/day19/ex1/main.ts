import { input } from "../input.js";

interface ComplexRule {
    key: 'x' | 'm' | 'a' | 's';
    operator: '<' | '>';
    value: number;
    destination: string;
}
type Rule = string | ComplexRule;

interface Part {
    x: number;
    m: number;
    a: number;
    s: number;
    result: 'A' | 'R' | undefined;
}

const [workflowsStr, partsStr] = input.split('\n\n');

const workflows: { [key: string]: Rule[] } = {};

workflowsStr.split('\n').forEach(ruleStr => {
    const [_match, workflowName, content] = ruleStr.match(/(.+){(.+)}/) as RegExpMatchArray;
    const rules: Rule[] = content.split(',').map(ruleStr => {
        const matchRule = ruleStr.match(/([xmas])([<>])(\d+):(.+)/);
        if (!matchRule) {
            const destination = ruleStr;
            return destination as Rule;
        }

        const [_match, key, operator, value, destination] = matchRule;
        return {
            key,
            operator,
            value: parseInt(value),
            destination
        } as ComplexRule;
    });
    workflows[workflowName] = rules;
});

const parts: Part[] = partsStr.split('\n').map(partStr => {
    const [_match, x, m, a, s] = partStr.match(/{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/) as RegExpMatchArray;
    return {
        x: parseInt(x),
        m: parseInt(m),
        a: parseInt(a),
        s: parseInt(s),
        result: undefined
    };
});

parts.forEach(part => {    
    let currentWorkflow: Rule[] | undefined = workflows['in'];

    while (currentWorkflow) {
        for (const rule of currentWorkflow) {
            if (typeof rule === 'string') {
                goTo(rule);
                break;
            } else {
                if ((rule.operator === '<' && part[rule.key] < rule.value) 
                            || (rule.operator === '>' && part[rule.key] > rule.value)) {
                    goTo(rule.destination);
                    break;
                }
            }
        }
    }

    function goTo(destination: string) {
        if (destination === 'A'|| destination === 'R') {
            part.result = destination;
            currentWorkflow = undefined;
        } else {
            currentWorkflow = workflows[destination];
        }
    }
});

console.log(parts
    .filter(part => part.result === 'A')
    .map(part => part.x + part.m + part.a + part.s)
    .reduce((a, b) => a + b)
);