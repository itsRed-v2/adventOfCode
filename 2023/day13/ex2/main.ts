import { input } from "../input.js";

console.log(input.split('\n\n').map(terrainStr => {
    const terrain = terrainStr.split('\n');

    for (let i = 0; i < terrain.length - 1; i++) {
        if (checkHorizontalSymmetry(terrain, i)) return (i + 1) * 100;
    }
    for (let i = 0; i < terrain[0].length - 1; i++) {
        if (checkVerticalSymmetry(terrain, i)) return i + 1;
    }

    throw new Error("No axis found");
}).reduce((a, b) => a + b));

function checkHorizontalSymmetry(terrain: string[], axisIndex: number) {
    let differences = 0;

    for (let offset = 0; isInTerrain(offset); offset++) {
        const row1 = axisIndex - offset;
        const row2 = axisIndex + offset + 1;
        differences += compareRows(terrain, row1, row2);
    }

    return differences === 1;

    function isInTerrain(offset: number) {
        return axisIndex - offset >= 0 && axisIndex + offset + 1 < terrain.length;
    }
}

function checkVerticalSymmetry(terrain: string[], axisIndex: number) {
    let differences = 0;

    for (let offset = 0; isInTerrain(offset); offset++) {
        const col1 = axisIndex - offset;
        const col2 = axisIndex + offset + 1;
        differences += compareCols(terrain, col1, col2);
    }

    return differences === 1;

    function isInTerrain(offset: number) {
        return axisIndex - offset >= 0 && axisIndex + offset + 1 < terrain[0].length;
    }
}

function compareCols(terrain: string[], col1: number, col2: number) {
    let differences = 0;
    for (let i = 0; i < terrain.length; i++) {
        if (terrain[i][col1] !== terrain[i][col2]) differences++;
    }
    return differences;
}

function compareRows(terrain: string[], row1: number, row2: number) {
    let differences = 0;
    for (let i = 0; i < terrain[0].length; i++) {
        if (terrain[row1][i] !== terrain[row2][i]) differences++;
    }
    return differences;
}