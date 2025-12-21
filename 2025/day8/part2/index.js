import { INPUT } from '../input.js';

const points = INPUT.split("\n").map(line => line.split(",")).map(textCoords => ({
    x: parseInt(textCoords[0]),
    y: parseInt(textCoords[1]),
    z: parseInt(textCoords[2])
}));

const pairs = [];
for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
        pairs.push({
            first: points[i],
            second: points[j],
            distance: euclidianDistance(points[i], points[j])
        });
    }
}

pairs.sort((a, b) => a.distance - b.distance);

const circuits = [];
for (const p of points) {
    circuits.push([p]);
}

for (let i = 0; i < pairs.length; i++) {
    connect(pairs[i], circuits);
    if (circuits.length === 1) {
        console.log("Done");
        console.log("Last pair to connect:", pairs[i]);
        console.log("Product of the x coordinate of the last two boxes:", pairs[i].first.x * pairs[i].second.x);
        break;
    }
}

// ===== FUNCTIONS =====

function connect(pair, circuits) {
    const firstCircuit = circuits.find(circ => circ.includes(pair.first));
    const secondCircuit = circuits.find(circ => circ.includes(pair.second));
    if (firstCircuit === secondCircuit) return;
    for (const point of secondCircuit) {
        firstCircuit.push(point);
    }
    circuits.splice(circuits.indexOf(secondCircuit), 1);
}

function euclidianDistance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
