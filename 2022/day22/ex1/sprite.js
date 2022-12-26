export { newSprite };
function newSprite(map) {
    let startingPosX = map[0].findIndex(tile => tile === "open");
    let pos = newVector(startingPosX, 0);
    const dir = newDirection();
    return {
        getPos: () => pos,
        forward,
        turnLeft: dir.turnLeft,
        turnRight: dir.turnRight,
        getDirID: dir.getDirID
    };
    function forward(amount) {
        for (let i = 0; i < amount; i++) {
            const nextPos = getNextPos(pos);
            const currentTile = tileAt(nextPos);
            if (currentTile === "wall") {
                break;
            }
            else if (currentTile === "open") {
                pos = nextPos;
            }
            else {
                throw "currentTile is undefined";
            }
        }
    }
    function getNextPos(pos) {
        let newPos = pos.clone();
        const dirVec = dir.getVector();
        newPos.add(dirVec);
        if (tileAt(newPos) === undefined) {
            do {
                newPos.subtract(dirVec);
            } while (tileAt(newPos) !== undefined);
            newPos.add(dirVec);
        }
        return newPos;
    }
    function tileAt(vec) {
        return map[vec.y]?.[vec.x];
    }
}
function newDirection() {
    let dirID = 0;
    return {
        turnLeft,
        turnRight,
        getVector,
        getDirID: () => dirID
    };
    function turnRight() {
        dirID += 1;
        if (dirID > 3)
            dirID = 0;
    }
    function turnLeft() {
        dirID -= 1;
        if (dirID < 0)
            dirID = 3;
    }
    function getVector() {
        if (dirID === 0)
            return newVector(1, 0);
        if (dirID === 1)
            return newVector(0, 1);
        if (dirID === 2)
            return newVector(-1, 0);
        if (dirID === 3)
            return newVector(0, -1);
    }
}
function newVector(x, y) {
    return {
        get x() { return x; },
        get y() { return y; },
        add,
        clone,
        subtract
    };
    function add(vec) {
        x += vec.x;
        y += vec.y;
    }
    function subtract(vec) {
        x -= vec.x;
        y -= vec.y;
    }
    function clone() {
        return newVector(x, y);
    }
}
