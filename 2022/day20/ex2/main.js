import { input } from "../input.js";

const DECRYPTION_KEY = 811589153;

const nbList = input.split("\n").map(line => {
	return { value: parseInt(line) * DECRYPTION_KEY }
});

const mixingList = [...nbList];

for (let i = 0; i < 10; i++) {
	for (const refNb of nbList) {
		let index = mixingList.indexOf(refNb);
		mixingList.splice(index, 1);
	
		let newIndex = getNewIndex(index, refNb.value, nbList.length);
		mixingList.splice(newIndex, 0, refNb);
	}
}

const zeroRef = nbList.find(o => o.value === 0);
const zeroIndex = mixingList.indexOf(zeroRef);

const valAt1k = mixingList[getIndexAfter(zeroIndex, 1000, mixingList.length)];
const valAt2k = mixingList[getIndexAfter(zeroIndex, 2000, mixingList.length)];
const valAt3k = mixingList[getIndexAfter(zeroIndex, 3000, mixingList.length)];
console.log(valAt1k.value + valAt2k.value + valAt3k.value);

function getNewIndex(oldIndex, offset, arrayLength) {
	let newIndex = oldIndex + offset
	newIndex %= arrayLength - 1;
	while (newIndex <= 0) newIndex += arrayLength - 1;
	return newIndex;
}

function getIndexAfter(oldIndex, offset, arrayLength) {
	let newIndex = oldIndex + offset;
	newIndex %= arrayLength;
	return newIndex;
}