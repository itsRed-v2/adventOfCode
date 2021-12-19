import chai from "chai";
const expect = chai.expect;

import {
	addNumbers,
	reduce,
	explode,
	split,
	getPair,
	calculateMagnitude
} from "../functions.mjs";

describe("#explode()", () => {
	it("explose le nombre", () => {
		expect(explode("[[6,[5,[4,[3,2]]]],1]")).to.eql("[[6,[5,[7,0]]],3]");
	});
	it("le nombre de gauche est ignoré si il n'y a pas de nombre à sa gauche", () => {
		expect(explode("[[[[[9,8],1],2],3],4]")).to.eql("[[[[0,9],2],3],4]");
	});
	it("le nombre de droite est ignoré si il n'y a pas de nombre à sa droite", () => {
		expect(explode("[7,[6,[5,[4,[3,2]]]]]")).to.eql("[7,[6,[5,[7,0]]]]");
		expect(explode("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]")).to.eql("[[3,[2,[8,0]]],[9,[5,[7,0]]]]");
	});
	it("explose seulement la première paire explosable", () => {
		expect(explode("[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]")).to.eql("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]");
	});
	it("explose des paires avec des nombres supérieurs à 9", () => {
		expect(explode("[[3,[2,[1,[13,3]]]],[6,[5,[4,[3,2]]]]]")).to.eql("[[3,[2,[14,0]]],[9,[5,[4,[3,2]]]]]");
	});
	it("ajoute à un nombre supérieur à 9 (gauche)", () => {
		expect(explode("[[3,[2,[11,[17,3]]]],[6,[5,[4,[3,2]]]]]")).to.eql("[[3,[2,[28,0]]],[9,[5,[4,[3,2]]]]]");
		expect(explode("[[3,[2,[9,[17,3]]]],[6,[5,[4,[3,2]]]]]")).to.eql("[[3,[2,[26,0]]],[9,[5,[4,[3,2]]]]]");
	});
	it("ajoute à un nombre supérieur à 9 (droite)", () => {
		expect(explode("[[3,[2,[1,[7,15]]]],[12,[5,[4,[3,2]]]]]")).to.eql("[[3,[2,[8,0]]],[27,[5,[4,[3,2]]]]]");
		expect(explode("[[3,[2,[1,[7,15]]]],[7,[5,[4,[3,2]]]]]")).to.eql("[[3,[2,[8,0]]],[22,[5,[4,[3,2]]]]]");
	});
	it("renvoie le même string si il ne contient pas de paire explosable", () => {
		expect(explode("[9,[8,7]]")).to.eql("[9,[8,7]]");
	});
	it("multi-test", () => {
		expect(explode("[[3,[2,[13,[24,15]]]],[12,[5,[4,[3,2]]]]]")).to.eql("[[3,[2,[37,0]]],[27,[5,[4,[3,2]]]]]");
	});
});

describe("#split()", () => {
	it("split le nombre (nombre impair)", () => {
		expect(split("[[[[0,7],4],[[7,8],[0,13]]],[1,1]]")).to.eql("[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]");
	});
	it("split le nombre (nombre pair)", () => {
		expect(split("[[[[0,7],4],[[7,8],[0,12]]],[1,1]]")).to.eql("[[[[0,7],4],[[7,8],[0,[6,6]]]],[1,1]]");
	});
	it("split seulement le premier nombre splittable", () => {
		expect(split("[[[[0,7],4],[15,[0,13]]],[1,1]]")).to.eql("[[[[0,7],4],[[7,8],[0,13]]],[1,1]]");
	});
	it("renvoie le même string si il ne contient pas de nombre splittable", () => {
		expect(split("[9,[8,7]]")).to.eql("[9,[8,7]]");
	});
});

describe("#reduce()", () => {
	it("réduit le nombre au maximum", () => {
		expect(reduce("[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]")).to.eql("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]");
	});
});

describe("#addNumbers()", () => {
	it("ajoute les deux nombres et les réduit", () => {
		expect(addNumbers("[[[[4,3],4],4],[7,[[8,4],9]]]", "[1,1]")).to.eql("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]");
	});
});

describe("#getPair()", () => {
	it ("renvoie la pair commencant à l'index indiqué", () => {
		expect(getPair("[[3,[2,[1,[13,3]]]],[6,[5,[4,[3,2]]]]]", 10)).to.eql("[13,3]");
	});
})

describe("#calculateMagnitude()", () => {
	it ("calcule la magnitude", () => {
		expect(calculateMagnitude(
			[[1,2],[[3,4],5]]
			)).to.eql(143);
		expect(calculateMagnitude(
			[[[[0,7],4],[[7,8],[6,0]]],[8,1]]
			)).to.eql(1384);
	});
})