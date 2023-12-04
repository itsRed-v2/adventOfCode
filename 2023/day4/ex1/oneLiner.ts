console.log((await import("../input.js")).input.split('\n').map(cardStr => (matches => matches == 0 ? 0 : 2 ** (matches - 1))((([winning, numbers]) => numbers.filter(n => winning.includes(n)).length)(cardStr.split(': ')[1].split(' | ').map(valuesString => valuesString.split(' ').filter(str => str != '').map(str => parseInt(str)))))).reduce((a, b) => a + b));

// Note: the export is only there to prevent warnings from typescript because the 
// file would not be considered a module. The code still works without it.
export {}