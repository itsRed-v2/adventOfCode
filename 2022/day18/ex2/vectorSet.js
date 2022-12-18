export function VectorSet() {
	const content = [];

	return Object.freeze({
		content,
		contains,
		add,
		addAll,
		clear
	});

	function add(vec) {
		if (!contains(vec)) content.push(vec);
	}

	function addAll(otherSet) {
		for (const v of otherSet.content) {
			add(v);
		}
	}

	function clear() {
		content.splice(0, content.length);
	}

	function contains(vec) {
		for (const v of content) {
			if (vec.equals(v)) return true;
		}
		return false;
	}
}