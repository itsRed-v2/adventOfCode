import { input } from "../input.js";

type Compared = number | Compared[];
type Order = boolean | undefined;

const pairs: Compared[][] = input.split("\n\n").map(lines => {
	return lines.split("\n").map(strArr => eval(strArr));
});

const orderList = pairs.map(pair => {
	return compare(pair[0], pair[1]);
});

let indexSum = 0;
orderList.forEach((order, index) => {
	if (order) indexSum += index + 1;
});

console.log(indexSum);

// functions

function compare(left: Compared, right: Compared): Order {
	if (typeof left === "number" && typeof right === "number") {
		return compareInt(left, right);
	} else if (Array.isArray(left) && Array.isArray(right)) {
		return compareArrays(left, right);
	} else {
		if (typeof left === "number") left = [left];
		if (typeof right === "number") right = [right];
		return compareArrays(left, right);
	}
}

function compareInt(left: number, right: number): Order {
	if (left === right) return undefined;
	return left < right;
}

function compareArrays(left: Compared[], right: Compared[]): Order {
	for (let i = 0;; i++) {
		if (i >= left.length && i >= right.length) return undefined;
		if (i >= left.length) return true;
		if (i >= right.length) return false;

		let leftVal = left[i];
		let rightVal = right[i];

		let result = compare(leftVal, rightVal);
		if (result === false || result === true) return result;
	}
}