import Status from "./status.mjs";

export default class PathNode {
	constructor(x, y, parentNode, TERRAIN) {
		if (parentNode === undefined)
			this.riskCost = parseInt(TERRAIN[x][y]);
		else this.riskCost = parentNode.riskCost + parseInt(TERRAIN[x][y]); // risk level of the path to this node	

		this.hCost = (TERRAIN.length - (x + 1)) + (TERRAIN[0].length - (y + 1)); // distance from end node

		this.status = Status.OPEN;

		this.x = x;
		this.y = y;
	}

	fCost() {
		return this.hCost + this.riskCost;
	}
}