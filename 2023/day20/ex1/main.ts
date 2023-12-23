import { input } from "../input.js";
import { Signal, Module, FlipFlop, Conjunction, Broadcaster } from "./modules.js";
import { Queue } from "./queue.js";

const DEBUG = false;

const modules: { [key: string]: Module } = {};

// Parsing modules

input.split('\n').forEach(line => {
	const [label, target] = line.split(' -> ');
	const destinations = target.split(', ');

	if (label.startsWith('%')) {
		const name = label.substring(1);
		modules[name] = new FlipFlop(destinations);
	}
	else if (label.startsWith('&')) {
		const name = label.substring(1);
		modules[name] = new Conjunction(destinations);
	}
	else if (label === 'broadcaster') {
		modules[label] = new Broadcaster(destinations);
	}
	else throw new Error("Invalid label");
});

// Initializing conjunction modules

Object.entries(modules).forEach(([name, module]) => {
	module.destinations.forEach(dest => {
		const destinationModule = modules[dest];
		if (destinationModule?.type !== 'conjunction') return;
		const conjunction = destinationModule as Conjunction;
		conjunction.memory[name] = 'low';
	});
});

// Processing pulses

let totalHigh = 0;
let totalLow = 0;
for (let i = 0; i < 1000; i++) {
	let { high, low } = pushButton(modules);
	totalHigh += high;
	totalLow += low;
}

console.log('High pulses:', totalHigh);
console.log('Low pulses:', totalLow);
console.log('Result:', totalHigh * totalLow);

// Functions

function pushButton(modules: { [key: string]: Module }) {
	if (DEBUG) console.log('---- BUTTON PUSH ----');

	const signals = new Queue<Signal>();
	signals.enqueue({
		source: 'button',
		destination: 'broadcaster',
		pulse: 'low'
	});
	
	let highPulses = 0;
	let lowPulses = 1; // The button signal is low, we start at 1
	
	while (signals.size() > 0) {
		const inputSignal = signals.dequeue() as Signal;
		const module = modules[inputSignal.destination];
		if (module === undefined) continue;

		const outputValue = module.accept(inputSignal);
		if (outputValue === undefined) continue;
	
		const outputSignals: Signal[] = module.destinations.map(dest => ({
			source: inputSignal.destination,
			destination: dest,
			pulse: outputValue,
		}));
		signals.enqueue(...outputSignals);
	
		outputSignals.forEach(signal => {
			if (signal.pulse === 'low') lowPulses++;
			else highPulses++;

			if (DEBUG) console.log(`${signal.source} -${signal.pulse}-> ${signal.destination}`);
		});
	}

	if (DEBUG) console.log('---- SEQUENCE ENDED ----');
	
	return {
		high: highPulses,
		low: lowPulses,
	};
}