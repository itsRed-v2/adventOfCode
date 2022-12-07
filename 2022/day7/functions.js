export {
	listALLdirectories,
	calculateDirSize,
	display
}

function listALLdirectories(dir) {
	let dirList = [];
	for (const key in dir) {
		let val = dir[key];
		if (typeof val === "object") {
			dirList.push(val);
			dirList = dirList.concat(listALLdirectories(val));
		}
	}
	return dirList;
}

function calculateDirSize(dir) {
	let size = 0;
	for (const key in dir) {
		let val = dir[key];
		if (typeof val === "object") {
			size += calculateDirSize(val);
		} else if (typeof val === "number") {
			size += val;
		} else {
			console.log("ERREUR: type:", typeof val);
			console.log(dir);
		}
	}
	return size;
}

function display(dir, depth = 0) {
	const indentation = "   ".repeat(depth);
	for (const key in dir) {
		let val = dir[key];
		if (typeof val === "object") {
			console.log(`${indentation}${key}:`);
			display(val, depth + 1);
		}
		else {
			console.log(`${indentation}- ${key} ${val}`);
		}
	}
}