import { INPUT } from '../input.js'

const pressCount = INPUT.split("\n").map((line, lineNumber) => {
    const segments = line.split(" ");

    const joltageText = segments[segments.length - 1];

    const joltageReq = joltageText.substring(1, joltageText.length - 1)
            .split(",")
            .map(number => parseInt(number))

    const buttons = [];

    const buttonsText = segments.slice(1, segments.length - 1);
    for (const buttonTxt of buttonsText) {
        const digits = buttonTxt.substring(1, buttonTxt.length - 1).split(",");
        const button = new Array(joltageReq.length).fill(0)
        for (const d of digits) {
            button[parseInt(d)] = 1;
        }
        buttons.push(button);
    }

    const system = [];
    for (let j = 0; j < joltageReq.length; j++) {
        const line = [];
        for (let b = 0; b < buttons.length; b++) {
            const button = buttons[b];
            line.push(button[j]);
        }
        line.push(joltageReq[j]);
        system.push(line);
    }

    // console.log();
    // console.log("#### LINE NUMBER", lineNumber, "####");
    // console.log("Before solve:");
    // console.log(system);

    const { solutions, parameters } = pivotDeGauss(system);

    console.log("Parameters:", parameters);
    const fewestButtonClicks = bruteForceParameters(buttons, joltageReq, solutions, parameters);

    console.log(fewestButtonClicks);

    // const parametersValues = new Array(parameters.length).fill(2);
    // for (let i = 0; i < solutions.length; i++) {
    //     console.log("Valeur du coefficient", i, ":", solutions[i](parametersValues));
    // }

    return fewestButtonClicks;

}).reduce((a, b) => a + b);

console.log("Fewest number of button presses required:", pressCount);

// ===== Functions =====

/// Résout un système de la forme
// | c1,1 * a + c1,2 * b + c1,3 * c = r1
// | c2,1 * a + c2,2 * b + c2,3 * c = r2
// Où chaque élément de la liste system est une liste correspondant à une équation du système
// contenant dans l'ordre les coefficients cn,1 ; cn,2 ; cn,3 ; rn
// Le nombre de lignes et de coefficients par ligne peut varier
// mais le nombre de coefficients doit être le même pour chaque ligne
function pivotDeGauss(system) {
    const pivotList = [];

    // Retirer 1 car le dernier élément n'est pas un coefficient et représente r;
    const coefficientCount = system[0].length - 1;

    // On triangularise le système par transduction selon l'algorithme de Gauss
    // (Ces termes ont un vrai sens mathématique)

    for (let lineIndex = 0; lineIndex < system.length; lineIndex++) {
        const line = system[lineIndex];

        // On prend pour pivot l'inconnue associée au premier coefficient non nul (on la représente par son indice)
        let pivot = line.findIndex(coefficient => coefficient != 0);

        // Si tous les coefficients de la ligne sont nuls, on saute cette ligne
        if (pivot === coefficientCount || pivot === -1) continue;

        pivotList.push(pivot);

        for (let i = lineIndex + 1; i < system.length; i++) {
            const modifiedLine = system[i];
            const factor = - modifiedLine[pivot] / line[pivot];

            // Cet appel va appliquer la transduction au contenu de modifiedLine
            scaleAndAdd(modifiedLine, line, factor);
        }
    }

    // Une fois le système triangularisé, on détermine les inconnues
    // qui n'ont pas servi de pivot: ces inconnues vont paramétrer
    // l'ensemble solution

    const parameterUnknowns = [];
    for (let i = 0; i < coefficientCount; i++) {
        if (!pivotList.includes(i)) {
            parameterUnknowns.push(i);
        }
    }

    // console.log(pivotList);
    // console.log("Freedom:", parameterUnknowns);
    // console.log(system);

    // On remonte le système et les pivots et pour chaque ligne on détermine
    // la valeur de l'inconnue pivot en fonction des inconnues paramètres
    // et des inconnues déterminées aux lignes précédentes.
    // -> Chaque inconnue est donc représentée par une fonction qui calcule sa
    // valeur en fonction des paramètres

    const solutions = new Array(coefficientCount).fill(undefined);

    // On met des fonctions dummy en tant que solutions des inconnues paramètres,
    // leur seul role est de renvoyer la valeur du paramètre correspondant
    for (const parameter of parameterUnknowns) {
        const solution = (parameters) => {
            return parameters[parameterUnknowns.indexOf(parameter)];
        }
        solutions[parameter] = solution;
    }

    for (let lineIndex = system.length - 1; lineIndex >= 0; lineIndex--) {
        const line = system[lineIndex];

        // Le pivot est toujours l'inconnue associée au premier coefficient non nul !
        let pivot = line.findIndex(coefficient => coefficient !== 0);

        // Si tous les coefficients de la ligne sont nuls, on saute cette ligne
        if (pivot === coefficientCount || pivot === -1) continue;

        const solution = (parameters) => {
            // On résout pour le pivot l'équation numéro lineIndex, qui ne peut contenir
            // qu'une inconnue qui n'a pas déjà été calculée, d'après l'algorithme du pivot de gauss

            // On initialize la valeur de l'iconnue pivot à r
            let value = line[line.length - 1];

            // On soustrait à la valeur de l'inconnue la valeur de tous les autres termes de la somme où elle se trouve
            for (let coefficientIndex = 0; coefficientIndex < coefficientCount; coefficientIndex++) {
                const coefficient = line[coefficientIndex];

                // Si le coefficient est nul, on l'ignore
                if (line[coefficientIndex] === 0) continue;
                // Si l'inconnue est celle qu'on cherche à déterminer, on l'ignore
                if (coefficientIndex === pivot) continue;
                // Si l'inconnue est un paramètre, on prend sa valeur dans la liste
                if (parameterUnknowns.includes(coefficientIndex)) {
                    value -= coefficient * parameters[parameterUnknowns.indexOf(coefficientIndex)];
                }
                // Sinon, l'inconnue est nécessairement un pivot d'une ligne en dessous,
                // et sa valeur a donc déjà été calculée lors d'une itération précédente de cette boucle
                else {
                    // On récupère la fonction solution de cette inconnue et on lui applique
                    // les paramètres pour obtenir la valeur de l'inconnue
                    value -= coefficient * solutions[coefficientIndex](parameters);
                }
            }

            // On divise la valeur obtenue par le coefficient se trouvant devant l'inconnue qu'on cherche.
            value /= line[pivot];

            // À cause des erreurs de flottant, il faut arrondir les nombres
            // pour les retransformer en entiers s'ils dérivent.
            // Par exemple, on pourrait obtenir 7.0000000000000036 au lieu de 7
            // On arrondit à la 5e décimale pour différencier les cas où la solution
            // devrait être entiere de ceux où elle est réellement décimale.
            return +value.toFixed(5);
        }

        solutions[pivot] = solution;
    }

    return {
        solutions: solutions,
        parameters: parameterUnknowns
    };
}

function scaleAndAdd(line1, line2, factor) {
    for (let i = 0; i < line1.length; i++) {
        line1[i] += line2[i] * factor;
    }
}

function bruteForceParameters(buttons, joltageReq, solutions, parameterIndices) {
    let fewestButtonClicks = Infinity;

    for (const params of generateParameters(buttons, joltageReq, parameterIndices)) {
        const joltage = new Array(joltageReq.length).fill(0);
        let totalClickCount = 0;

        if (!isSolutionValid(solutions, params)) continue;

        for (let b = 0; b < buttons.length; b++) {
            const clickCount = solutions[b](params);

            totalClickCount += clickCount;
            for (let j = 0; j < joltageReq.length; j++) {
                joltage[j] += buttons[b][j] * clickCount;
            }
        }

        if (arraysEqual(joltage, joltageReq)) {
            fewestButtonClicks = Math.min(fewestButtonClicks, totalClickCount);
        }
    }

    return fewestButtonClicks;
}

function arraysEqual(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) return false;
    }
    return true;
}

function isSolutionValid(solutions, parameters) {
    return solutions.every(solution => {
        const value = solution(parameters);
        return value >= 0 && Number.isInteger(value);
    });
}

function* generateParameters(buttons, joltageReq, parameterIndices) {
    if (parameterIndices.length === 0) {
        yield [];
        return;
    }

    const firstParameterIndex = parameterIndices[0];
    const button = buttons[firstParameterIndex];

    let parameterMaxValue = Infinity;
    for (let j = 0; j < joltageReq.length; j++) {
        if (button[j] === 1) {
            parameterMaxValue = Math.min(parameterMaxValue, joltageReq[j]);
        }
    }

    for (let i = 0; i <= parameterMaxValue; i++) {
        for (const params of generateParameters(buttons, joltageReq, parameterIndices.slice(1))) {
            yield [i].concat(params);
        }
    }
}
