#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <regex.h>

#define TRUE 1
#define FALSE 0

char* readline(FILE* file) {
    int maxLineLength = 300;
    char* lineBuffer = malloc(maxLineLength * sizeof(char));

    int count = 0;
    while (count < maxLineLength) {
        char ch = getc(file);
        if (ch == '\n' || ch == EOF) break;
        lineBuffer[count] = ch;
        count++;
    }

    char* line = malloc((count + 1) * sizeof(char));
    strncpy(line, lineBuffer, count);
    free(lineBuffer);
    line[count] = '\0';
    return line;
}

typedef struct {
    int width;
    int height;
    char* cells;
} Grid;

typedef struct {
    int x;
    int y;
} Vec;

Grid createGrid(int width, int height) {
    Grid grid;
    grid.width = width;
    grid.height = height;
    grid.cells = malloc(width * height * sizeof(char));
    return grid;
}

char charAt(Grid grid, Vec pos) {
    return grid.cells[pos.y * grid.width + pos.x];
}

Vec add(Vec v1, Vec v2) {
    return (Vec) {
        .x = v1.x + v2.x,
        .y = v1.y + v2.y
    };
}

Vec reverse(Vec v) {
    return (Vec) {
        .x = -v.x,
        .y = -v.y
    };
}

char checkMAS(Grid grid, Vec pos, Vec direction) {
    char* word = "MAS";
    pos = add(pos, reverse(direction));
    for (int i = 0; i < strlen(word); i++) {
        if (pos.x >= grid.width || pos.x < 0 || pos.y >= grid.height || pos.y < 0) return FALSE;
        if (charAt(grid, pos) != word[i]) return FALSE;
        pos = add(pos, direction);
    }
    return TRUE;
}

char isXmasAt(Grid grid, Vec pos) {
    static const Vec directions[2] = {
        { 1, 1 },
        { 1, -1 }
    };

    for (int i = 0; i < 2; i++) {
        if (!checkMAS(grid, pos, directions[i]) && !checkMAS(grid, pos, reverse(directions[i])))
            return FALSE;
    }

    return TRUE;
}

int main() {
    FILE* input = fopen("input.txt", "r");

    int width = strlen(readline(input));
    int height = 1;
    while (strlen(readline(input))) height++;
    rewind(input);

    printf("width, height: %d, %d\n", width, height);

    Grid grid = createGrid(width, height);
    for (int y = 0; y < height; y++) {
        strncpy(grid.cells + (width * y), readline(input), width);
    }

    int xmasCount = 0;
    Vec pos;
    for (pos.y = 0; pos.y < height; pos.y++) {
        for (pos.x = 0; pos.x < width; pos.x++) {
            if (isXmasAt(grid, pos)) xmasCount++;
        }
    }

    printf("X-MAS Count: %d\n", xmasCount);

    return 0;
}
