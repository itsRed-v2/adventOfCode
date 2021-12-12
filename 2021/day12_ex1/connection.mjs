export default class Connection {
	constructor(a, b) {
		this.a = a;
		this.b = b;
	}

	includes(name) {
		if (name === this.a) return true;
		if (name === this.b) return true;
		return false;
 	}

	getConnected(name) {
		if (name === this.a) return this.b;
		if (name === this.b) return this.a;
	}
}