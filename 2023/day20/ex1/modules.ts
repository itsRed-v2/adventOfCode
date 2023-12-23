type Pulse = 'low' | 'high';

interface Signal {
	source: string;
	destination: string;
	pulse: Pulse;
}

type ModuleType = 'flip-flop' | 'conjunction' | 'broadcaster';

interface Module {
	destinations: string[];
	type: ModuleType;
	accept: (signal: Signal) => Pulse | undefined;
}

class FlipFlop implements Module {
	destinations: string[];
	type: ModuleType = 'flip-flop';
	isOn = false;

	constructor(destinations: string[]) {
		this.destinations = destinations;
	}

	accept(signal: Signal): Pulse | undefined {
		if (signal.pulse === 'high') return;
		this.isOn = !this.isOn;
		return this.isOn ? 'high' : 'low';
	}
}

class Conjunction implements Module {
	destinations: string[];
	type: ModuleType = 'conjunction';
	memory: { [key: string]: Pulse } = {};

	constructor(destinations: string[]) {
		this.destinations = destinations;
	}

	accept(signal: Signal): Pulse | undefined {
		this.memory[signal.source] = signal.pulse;
		if (Object.values(this.memory).every(p => p === 'high'))
			return 'low';
		else return 'high';
	}
}

class Broadcaster implements Module {
	destinations: string[];
	type: ModuleType = 'broadcaster';

	constructor(destinations: string[]) {
		this.destinations = destinations;
	}

	accept(signal: Signal): Pulse {
		return signal.pulse;
	}
}

export {
	Signal,
	Module,
	FlipFlop,
	Conjunction,
	Broadcaster
} 