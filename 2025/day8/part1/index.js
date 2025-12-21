import { INPUT } from '../input.js';

// Configuration (set to 10 for example and 1000 for real input)
const CONNECTIONS_TO_MAKE = 1000;



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

// console.log(pairs);
// console.log(pairs.length);

const circuits = [];
for (const p of points) {
    circuits.push([p]);
}


for (let i = 0; i < pairs.length && i < CONNECTIONS_TO_MAKE; i++) {
    connect(pairs[i], circuits);
}

circuits.sort((a, b) => b.length - a.length);

// console.log(circuits);
console.log("Product of the 3 largest circuit sizes: ", circuits[0].length * circuits[1].length * circuits[2].length);

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
