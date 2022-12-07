import { input } from "../input.js";
import {
	listALLdirectories,
	calculateDirSize,
	display
} from "../functions.js";

// constants declaration

const fileSystem = {
	"/": {},
};
let currentPath = ["/"];

// code

parseFileSystem(input);
display(fileSystem);

let totalSizeOfSmallDirs = 0;
for (const dir of listALLdirectories(fileSystem)) {
	let size = calculateDirSize(dir)
	if (size <= 100000) totalSizeOfSmallDirs += size;
}

console.log("total size:", totalSizeOfSmallDirs);

// functions

function parseFileSystem(input) {
	const termOutput = input.split("\n$ ");
	termOutput[0] = termOutput[0].slice(2); // removing the "$ " at the beginning of the first line

	for (let i = 0; i < termOutput.length; i++) {
		const currentLines = termOutput[i].split("\n");
		const command = currentLines[0];
		const cmdOutput = currentLines.slice(1);
	
		const matchCd = command.match(/^cd (.+)$/);
		if (matchCd) {
			changeDirectory(matchCd[1]);
			continue;
		}
	
		const matchLs = command.match(/^ls$/);
		if (matchLs) {
			for (const line of cmdOutput) {
				let matchFile = line.match(/^(\d+) (.+)$/);
				if (matchFile) {
					let fileSize = parseInt(matchFile[1]);
					let fileName = matchFile[2];
					currentDir()[fileName] = fileSize;
				}
			}
			continue;
		}
	
		console.warn("This is not cd AND not ls !!");
		return;
	}
}

function currentDir() {
	let dir = fileSystem;
	for (const dirName of currentPath) {
		dir = dir[dirName];
	}
	return dir;
}

function changeDirectory(cmdArg) {
	if (cmdArg === "/") {
		currentPath = ["/"];
	} else if (cmdArg === "..") {
		currentPath.pop();
	} else {
		currentDir()[cmdArg] = {};
		currentPath.push(cmdArg);
	}
}