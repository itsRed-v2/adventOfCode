type Direction = "north" | "south" | "east" | "west";

class Vector {
    x: number;
    y: number;

    static NORTH = new Vector(0, -1);
    static SOUTH = new Vector(0, 1);
    static EAST = new Vector(1, 0);
    static WEST = new Vector(-1, 0);
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    add(other: Vector) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
    
    equals(other: Vector) {
        return this.x === other.x && this.y === other.y;
    }

    subtract(other: Vector) {
        return new Vector(this.x - other.x, this.y - other.y);
    }
    
    static fromDirection(direction: Direction): Vector {
        switch (direction) {
            case "north":
                return Vector.NORTH;
            case "south":
                return Vector.SOUTH;
            case "east":
                return Vector.EAST;
            case "west":
                return Vector.WEST;
        }
    }
}

const allDirections: Direction[] = ["north", "south", "east", "west"];

function getOppositeDirection(direction: Direction): Direction {
    switch (direction) {
        case "north":
        return "south";
        case "south":
        return "north";
        case "east":
        return "west";
        case "west":
        return "east";
    }
}

export {
    Vector,
    Direction,
    getOppositeDirection,
    allDirections
}