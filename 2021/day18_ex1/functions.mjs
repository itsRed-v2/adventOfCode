function addNumbers(number1, number2) {
	return reduce(`[${number1},${number2}]`);
}

function reduce(strNum) {
	
	for (;;) {
		let explodedNum = explode(strNum);
		if (strNum !== explodedNum) {
			strNum = explodedNum;
			continue;
		}

		let splittedNum = split(strNum);
		if (strNum !== splittedNum) {
			strNum = splittedNum;
			continue;
		}

		break;
	}

	return strNum;
}

function explode(strNum) {

	// finding the explodable pair
	let depth = 0;
	let index = 0;
	for (;; index ++) {
		if (index == strNum.length) return strNum;

		const char = strNum[index];

		if (char === "[") depth++;
		if (char === "]") depth--;

		if (depth > 4) break;
	}

	let pair = getPair(strNum, index);
	let pairStartIndex = index;
	let pairEndIndex = index + pair.length;

	let match = pair.match(/^\[(\d+),(\d+)\]$/);
	let leftValue = parseInt(match[1]);
	let rightValue = parseInt(match[2]);

	// adding the right value
	let rightMatch = strNum.slice(pairEndIndex).match(/(\d+)/);

	if (rightMatch != null) {
		let newValue = parseInt(rightMatch[1]) + rightValue;
		let valueIndex = pairEndIndex + rightMatch.index;
		strNum = strNum.slice(0, valueIndex) + newValue + strNum.slice(valueIndex + rightMatch[1].length);
	}

	// replacing the pair with "0"
	strNum = strNum.slice(0, pairStartIndex) + "0" + strNum.slice(pairEndIndex);

	// adding the left value
	let leftMatch = strNum.slice(0, pairStartIndex).match(/(\d+).[^\d]*$/);

	if (leftMatch != null) {
		let newValue = parseInt(leftMatch[1]) + leftValue;
		strNum = strNum.slice(0, leftMatch.index) + newValue + strNum.slice(leftMatch.index + leftMatch[1].length);
	}

	return strNum;
}

function split(strNum) {
	let groups = strNum.split(/(\d{2})/);
	if (groups.length === 1) return strNum;

	let pair = `[${Math.floor(groups[1] / 2)},${Math.ceil(groups[1] / 2)}]`;

	strNum = groups[0] + pair;
	groups.splice(0, 2);
	strNum += groups.join("");

	return strNum;
}

function getPair(strNum, startIndex) {
	strNum = strNum.slice(startIndex);

	let depth = 0;
	let endIndex = 0;
	for (; endIndex < strNum.length; endIndex++) {
		const char = strNum[endIndex];

		if (char === "[") depth++;
		if (char === "]") depth--;

		if (depth == 0) break;
	}

	strNum = strNum.slice(0, endIndex + 1);

	return strNum;
}

function calculateMagnitude(pair) {
	let leftMagnitude;
	let rightMagnitude;

	if (typeof pair[0] === "number") leftMagnitude = pair[0];
	else leftMagnitude = calculateMagnitude(pair[0]);

	if (typeof pair[1] === "number") rightMagnitude = pair[1];
	else rightMagnitude = calculateMagnitude(pair[1]);

	leftMagnitude *= 3;
	rightMagnitude *= 2;

	return leftMagnitude + rightMagnitude;
}

export {
	addNumbers,
	reduce,
	explode,
	split,
	getPair,
	calculateMagnitude,
}