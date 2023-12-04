import { input } from "../input.js";

const cards = input.split('\n');
const cardCounts: number[] = new Array(cards.length).fill(1);

for (let i = 0; i < cards.length; i++) {
    const matchCount = getMatchingCount(cards[i]);
    for (let j = 1; j <= matchCount; j++) {
        cardCounts[j + i] += cardCounts[i];
    }
}

const totalCardCound = cardCounts.reduce((a, b) => a + b);
console.log(totalCardCound);

// Functions

function getMatchingCount(cardStr: string) {
    const values = cardStr.split(': ')[1];
    let [winning, numbers] = values.split(' | ').map(valuesString => {
        return valuesString.split(' ').filter(str => str != '').map(str => parseInt(str));
    });

    return numbers.filter(n => winning.includes(n)).length;
}