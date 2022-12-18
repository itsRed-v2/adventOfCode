// console.log((cubes => {
// 	return cubes.map(cube => cube.getNeighbors().map(neighbour => !cubes.some(c => neighbour.equals(c))).reduce((a, v) => a + v)).reduce((a, v) => a + v)
// })(((input, newVector) => {
// 	return input.split("\n").map(line => {
// 		return line.split(",").map(strNb => parseInt(strNb))
// 	}).map(arr => {
// 		return newVector(arr[0], arr[1], arr[2])
// 	})
// })(
// 	(await import("../input.js")).input,
// 	(await import("../vector.js")).newVector
// )));

console.log((cubes => cubes.map(cube => cube.getNeighbors().map(neighbour => !cubes.some(c => neighbour.equals(c))).reduce((a, v) => a + v)).reduce((a, v) => a + v))(((input, newVector) => input.split("\n").map(line => line.split(",").map(strNb => parseInt(strNb))).map(arr => newVector(arr[0], arr[1], arr[2])))((await import("../input.js")).input, (await import("../vector.js")).newVector)));
