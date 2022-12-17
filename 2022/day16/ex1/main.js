import { input } from "../input.js";

const valveMap = input.split("\n").map(line => {
	const match = line.match(/^Valve (..) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/);
	const name = match[1];
	const flowRate = parseInt(match[2]);
	const tunnelsTo = match[3].split(", ");
	return {
		name,
		flowRate,
		connections: tunnelsTo
	}
});

console.log(valveMap);

// printing for plotting

const connections = [];

for (const valve of valveMap) {
	const v = valve.name;
	for (const c of valve.connections) {
		if (!isAlreadyPrinted(v, c)) {
			connections.push([v, c]);
			console.log(`${v}-${c}`);
		}
	}
}

function isAlreadyPrinted(node1, node2) {
	for (const pair of connections) {
		if ((pair[0] === node1 && pair[1] === node2)
				|| (pair[0] === node2 && pair[1] === node1)) {
			return true;
		}
	}
	return false;
}