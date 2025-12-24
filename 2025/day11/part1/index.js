import { INPUT } from '../input.js'

const connections = {};

INPUT.split("\n").forEach(line => {
    const [device, outputsText] = line.split(": ");
    const outputs = outputsText.split(" ");
    connections[device] = outputs;
});

console.log(connections);

let paths = 0;
recursiveExplore("you");
console.log("Number of paths from 'you' to 'out':", paths);

function recursiveExplore(device) {
    for (const output of connections[device]) {
        if (output === "out") {
            paths++;
        } else {
            recursiveExplore(output);
        }
    }
}
