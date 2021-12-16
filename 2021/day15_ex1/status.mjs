export default class Status {
	
	static OPEN = new Status("open");
	static CLOSED = new Status("closed");

	constructor(name) {
		this.name = name;
	}
}