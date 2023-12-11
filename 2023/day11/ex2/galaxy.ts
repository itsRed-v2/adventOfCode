class Galaxy {
    x: number;
    y: number;
    columnsBefore: number = 0;
    rowsBefore: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    expand(factor: number) {
        this.x += this.columnsBefore * (factor - 1);
        this.y += this.rowsBefore * (factor - 1);
    }
}

export {
    Galaxy
}