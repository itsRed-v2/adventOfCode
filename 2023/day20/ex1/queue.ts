class Queue<T> {
	elements: T[] = [];
	
	enqueue(...el: T[]) {
		this.elements.push(...el);
	}

	dequeue() {
		return this.elements.shift();
	}

	size() {
		return this.elements.length;
	}
}

export {
	Queue
}