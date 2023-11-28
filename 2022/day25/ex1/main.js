import { input } from "../input.js";
console.log(input.split("\n").reduce((sum, value) => add(sum, value)));
function add(snafu1, snafu2) {
    let n1 = snafuToArray(snafu1);
    let n2 = snafuToArray(snafu2);
    for (let i = 0; i < n1.length || i < n2.length; i++) {
        n1[i] = nbAt(n1, i) + nbAt(n2, i);
        if (n1[i] > 2) {
            n1[i] -= 5;
            n1[i + 1] = nbAt(n1, i + 1) + 1;
        }
        if (n1[i] < -2) {
            n1[i] += 5;
            n1[i + 1] = nbAt(n1, i + 1) - 1;
        }
    }
    return arrayToSnafu(n1);
    function nbAt(arr, i) {
        return arr[i] ?? 0;
    }
}
function arrayToSnafu(array) {
    return array.reverse().map(n => "=-012"[n + 2]).join("");
}
function snafuToArray(snafu) {
    return snafu.split("").reverse().map(char => {
        return {
            "2": 2,
            "1": 1,
            "0": 0,
            "-": -1,
            "=": -2
        }[char] ?? 0;
    });
}
