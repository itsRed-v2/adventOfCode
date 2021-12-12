import Connection from "./connection.mjs";
import { input } from "./input.mjs";

const connections = input.split("\n").map(line => {
	const pair = line.split("-");
	return new Connection(pair[0], pair[1]);
});

let possiblePaths = [];

explore(["start"]);

// console.log("Possible paths:", possiblePaths);
console.log("There is", possiblePaths.length, "possible paths.");

function explore(exploredPath) {
	const current = exploredPath[exploredPath.length - 1];

	if (current === "end") {
		possiblePaths.push(exploredPath);
		return;
	}

	const connected = getConnectedTo(current).filter(name => isBigCave(name) || !exploredPath.includes(name));

	for (const name of connected) {
		explore([...exploredPath, name]);
	}
}

function getConnectedTo(name) {
	let connected = [];
	
	for (const connection of connections) {
		if (connection.includes(name)) connected.push(connection.getConnected(name));
	}

	return connected;
}

function isBigCave(name) {
	if (name === name.toUpperCase()) return true;
	if (name === name.toLowerCase()) return false;
}