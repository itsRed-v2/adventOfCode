import { INPUT } from '../input.js'

const pressCount = INPUT.split("\n").map(line => {
    const segments = line.split(" ");

    const diagram = segments[0];

    const objective = [];
    for (let i = 1; i < diagram.length - 1; i++) {
        objective.push(diagram[i] === "#");
    }

    const buttonsText = segments.slice(1, segments.length - 1);

    const buttons = [];
    for (const buttonTxt of buttonsText) {
        const digits = buttonTxt.substring(1, buttonTxt.length - 1).split(",");
        const button = new Array(objective.length).fill(false)
        for (const d of digits) {
            button[parseInt(d)] = true;
        }
        buttons.push(button);
    }

    let fewestButtonPresses = Infinity;
    for (const buttonCombination of combinations(buttons)) {
        let state = new Array(objective.length).fill(false);
        state = xor(state, buttonCombination);

        if (statesEqual(state, objective)) {
            fewestButtonPresses = Math.min(buttonCombination.length, fewestButtonPresses);
        }
    }

    return fewestButtonPresses;
}).reduce((a, b) => a + b);

console.log("Fewest number of button presses required:", pressCount);

// ===== Functions =====

function* combinations(list) {
    if (list.length === 0) {
        yield [];
        return;
    }

    for (const comb of combinations(list.slice(1))) {
        yield [list[0]].concat(comb);
        yield comb;
    }
}

function xor(state, buttons) {
    for (const button of buttons) {
        for (let i = 0; i < state.length; i++) {
            state[i] = state[i] != button[i] // Xor state[i] with button[i]
        }
    }
    return state;
}

function statesEqual(state1, state2) {
    for (let i = 0; i < state1.length; i++) {
        if (state1[i] != state2[i]) return false;
    }
    return true;
}
