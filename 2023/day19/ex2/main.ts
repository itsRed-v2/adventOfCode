import { input } from "../input.js";
import { PartRange, RatingRange, ComplexRule, Rule } from "./lib.js";

// Parsing workflows

const workflowsStr = input.split('\n\n')[0];
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

// Processing part ranges

const fullRatingRange = new RatingRange(1, 4000);
const everyPart = new PartRange(fullRatingRange, fullRatingRange, fullRatingRange, fullRatingRange);

console.log(countAcceptedParts(everyPart, 'in'));

function countAcceptedParts(parts: PartRange, workflowName: string): number {
    let acceptedPartCount = 0;
    const workflow = workflows[workflowName];

    for (let rule of workflow) {
        if (typeof rule === 'object') { // Complex rule case
            let passingParts = parts.whereConditionTrue(rule);
            parts = parts.whereConditionFalse(rule);
            redirect(passingParts, rule.destination);
        } else { // string rule case (the last rule with no condition)
            redirect(parts, rule);
            break;
        }
    }

    return acceptedPartCount;

    function redirect(parts: PartRange, destination: string) {
        if (destination === 'A') {
            acceptedPartCount += parts.size();
        } else if (destination !== 'R') {
            acceptedPartCount += countAcceptedParts(parts, destination);
        }
    }
}