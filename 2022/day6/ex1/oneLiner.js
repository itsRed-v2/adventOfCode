console.log((input => input.split("").findIndex((_char, i) => i < 4 ? false : (sequence => !sequence.split("").find((_char, seqIndex) => sequence.indexOf(sequence[seqIndex]) !== seqIndex))(input.slice(i - 4, i))))((await import("../input.js")).input));