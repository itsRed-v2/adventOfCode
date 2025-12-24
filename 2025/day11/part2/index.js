import { INPUT } from '../input.js'

const nodes = {};

INPUT.split("\n").forEach(line => {
    const [device, outputsText] = line.split(": ");
    const outputs = outputsText.split(" ");
    nodes[device] = {
        outputs: outputs,
        parents: [],
        pathsthroughDac: 0,
        pathsthroughFft: 0,
        pathsthroughBoth: 0,
        otherPaths: 0
    };
});

nodes["out"] = {
    outputs: [],
    parents: [],
    pathsthroughDac: 0,
    pathsthroughFft: 0,
    pathsthroughBoth: 0,
    otherPaths: 0
}

for (const [node, properties] of Object.entries(nodes)) {
    for (const child of properties.outputs) {
        nodes[child].parents.push(node);
    }
}

const openNodes = new Array();
const closedNodes = new Set();

openNodes.push("svr");
nodes["svr"].otherPaths = 1;

while (openNodes.length > 0) {
    const currentDeviceName = openNodes.shift();
    closedNodes.add(currentDeviceName);

    const currentDevice = nodes[currentDeviceName];

    if (currentDeviceName === "dac") {
        currentDevice.pathsthroughDac = currentDevice.otherPaths;
        currentDevice.pathsthroughBoth = currentDevice.pathsthroughFft;
    } else if (currentDeviceName === "fft") {
        currentDevice.pathsthroughFft = currentDevice.otherPaths;
        currentDevice.pathsthroughBoth = currentDevice.pathsthroughDac;
    }

    for (const childName of currentDevice.outputs) {
        const child = nodes[childName];
        child.pathsthroughDac += currentDevice.pathsthroughDac;
        child.pathsthroughFft += currentDevice.pathsthroughFft;
        child.pathsthroughBoth += currentDevice.pathsthroughBoth;
        child.otherPaths += currentDevice.otherPaths;

        if (child.parents.every(parent => closedNodes.has(parent))) {
            openNodes.push(childName);
        }
    }
}

console.log(nodes["out"]);

console.log("Number of paths from 'svr' to 'out' which visit 'dac' and 'fft':", nodes["out"].pathsthroughBoth);

