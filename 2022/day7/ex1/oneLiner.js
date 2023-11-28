// (
// 	(input, fileSystem, currentPath) =>
// 	(
// 		(yCombinator, yCombinator2args, currentDir) => 
// 		(
// 			(parseFileSystem, listALLdirectories, calculateDirSize, display) => 
// 			(fileSystem => console.log(display(fileSystem) + "total size:", listALLdirectories(fileSystem).reduce((totalSizeOfSmallDirs, dir) => ((size) => size <= 100000 ? totalSizeOfSmallDirs + size : totalSizeOfSmallDirs)(calculateDirSize(dir)), 0)))(parseFileSystem(input))
// 		)(
// 			input => (termOutput => [...Array(termOutput.length).keys()].forEach(i => (currentLines => (command => (matchCd => matchCd ? (cmdArg => cmdArg === "/" ? currentPath = ["/"] : cmdArg === ".." ? currentPath.pop() : [currentDir()[cmdArg] = new Object(), currentPath.push(cmdArg)])(matchCd[1]) : command.match(/^ls$/) ? currentLines.slice(1).forEach(line => (matchFile => matchFile ? currentDir()[matchFile[2]] = parseInt(matchFile[1]) : "")(line.match(/^(\d+) (.+)$/))) : console.warn("This is not cd AND not ls !!"))(command.match(/^cd (.+)$/)))(currentLines[0]))(termOutput[i].split("\n"))) ?? fileSystem)(("\n" + input).split("\n$ ").slice(1)),
// 			yCombinator(givenListAllDirectories => dir => Object.values(dir).reduce((dirList, val) => typeof val === "object" ? [...dirList, val, ...givenListAllDirectories(val)] : dirList, [])),
// 			yCombinator(givenCalculateDirSize => dir => Object.values(dir).reduce((size, val) => size + (typeof val === "object" ? givenCalculateDirSize(val) : typeof val === "number" ? val : 0), 0)),
// 			yCombinator2args(givenDisplay => (dir, depth = 0) => (indentation => Object.keys(dir).reduce((textResult, key) => (val => textResult + (typeof val === "object" ? `${indentation}${key}:\n` + givenDisplay(val, depth + 1) : `${indentation}- ${key} ${val}\n`))(dir[key]), ""))("   ".repeat(depth)))
// 		)
// 	)(
// 		make => (f => f(f))(f => make(x => f(f)(x))),
// 		make => (f => f(f))(f => make((a, b) => f(f)(a, b))),
// 		() => currentPath.reduce((dir, dirName) => dir[dirName], fileSystem)
// 	)
// )(
// 	(await import("../input.js")).input,
// 	{"/":{}},
// 	["/"]
// )

((input, fileSystem, currentPath) => ((yCombinator, yCombinator2args, currentDir) => ((parseFileSystem, listALLdirectories, calculateDirSize, display) => (fileSystem => console.log(display(fileSystem) + "total size:", listALLdirectories(fileSystem).reduce((totalSizeOfSmallDirs, dir) => (size => size <= 100000 ? totalSizeOfSmallDirs + size : totalSizeOfSmallDirs)(calculateDirSize(dir)), 0)))(parseFileSystem(input)))(input => (termOutput => [...Array(termOutput.length).keys()].forEach(i => (currentLines => (command => (matchCd => matchCd ? (cmdArg => cmdArg === "/" ? currentPath = ["/"] : cmdArg === ".." ? currentPath.pop() : [currentDir()[cmdArg] = new Object(), currentPath.push(cmdArg)])(matchCd[1]) : command.match(/^ls$/) ? currentLines.slice(1).forEach(line => (matchFile => matchFile ? currentDir()[matchFile[2]] = parseInt(matchFile[1]) : "")(line.match(/^(\d+) (.+)$/))) : console.warn("This is not cd AND not ls !!"))(command.match(/^cd (.+)$/)))(currentLines[0]))(termOutput[i].split("\n"))) ?? fileSystem)(("\n" + input).split("\n$ ").slice(1)), yCombinator(givenListAllDirectories => dir => Object.values(dir).reduce((dirList, val) => typeof val === "object" ? [...dirList, val, ...givenListAllDirectories(val)] : dirList, [])), yCombinator(givenCalculateDirSize => dir => Object.values(dir).reduce((size, val) => size + (typeof val === "object" ? givenCalculateDirSize(val) : typeof val === "number" ? val : 0), 0)), yCombinator2args(givenDisplay => (dir, depth = 0) => (indentation => Object.keys(dir).reduce((textResult, key) => (val => textResult + (typeof val === "object" ? `${indentation}${key}:\n` + givenDisplay(val, depth + 1) : `${indentation}- ${key} ${val}\n`))(dir[key]), ""))("   ".repeat(depth)))))(make => (f => f(f))(f => make(x => f(f)(x))), make => (f => f(f))(f => make((a, b) => f(f)(a, b))), () => currentPath.reduce((dir, dirName) => dir[dirName], fileSystem)))((await import("../input.js")).input, {"/":{}}, ["/"])