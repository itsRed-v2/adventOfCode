import { input } from "../input.js";

console.log(input.split('\n\n').map(terrainStr => {
    const terrain = terrainStr.split('\n');

    for (let i = 0; i < terrain.length - 1; i++) {
        if (checkHorizontalSymmetry(terrain, i)) return (i + 1) * 100;
    }
    for (let i = 0; i < terrain[0].length - 1; i++) {
        if (checkVerticalSymmetry(terrain, i)) return i + 1;
    }
    return 0;
}).reduce((a, b) => a + b));

function checkHorizontalSymmetry(terrain: string[], axisIndex: number) {
    for (let offset = 0; isInTerrain(offset); offset++) {
        const row1 = axisIndex - offset;
        const row2 = axisIndex + offset + 1;
        if (terrain[row1] !== terrain[row2]) return false;
    }

    return true;

    function isInTerrain(offset: number) {
        return axisIndex - offset >= 0 && axisIndex + offset + 1 < terrain.length;
    }
}

function checkVerticalSymmetry(terrain: string[], axisIndex: number) {
    const terrainWidth = terrain[0].length;

    for (let offset = 0; isInTerrain(offset); offset++) {
        const col1 = axisIndex - offset;
        const col2 = axisIndex + offset + 1;
        if (!compareRows(terrain, col1, col2)) return false;
    }

    return true;

    function isInTerrain(offset: number) {
        return axisIndex - offset >= 0 && axisIndex + offset + 1 < terrainWidth;
    }
}

function compareRows(terrain: string[], col1: number, col2: number) {
    for (let i = 0; i < terrain.length; i++) {
        if (terrain[i][col1] !== terrain[i][col2]) return false;
    }
    return true;
}