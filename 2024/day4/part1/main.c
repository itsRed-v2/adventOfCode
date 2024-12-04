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

Vec addVec(Vec v1, Vec v2) {
    return (Vec) {
        .x = v1.x + v2.x,
        .y = v1.y + v2.y
    };
}

char checkXmas(Grid grid, Vec pos, Vec direction) {
    char* word = "XMAS";
    for (int i = 0; i < strlen(word); i++) {
        if (pos.x >= grid.width || pos.x < 0 || pos.y >= grid.height || pos.y < 0) return FALSE;
        if (charAt(grid, pos) != word[i]) return FALSE;
        pos = addVec(pos, direction);
    }
    return TRUE;
}

int countXmasAt(Grid grid, Vec pos) {
    static const Vec directions[8] = {
        { 1, 0 },
        { -1, 0 },
        { 0, 1 },
        { 0, -1 },
        { 1, 1 },
        { 1, -1 },
        { -1, 1 },
        { -1, -1 },
    };

    int xmasCount = 0;
    for (int i = 0; i < 8; i++) {
        if (checkXmas(grid, pos, directions[i])) xmasCount++;
    }
    return xmasCount;
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
    for (int y = 0; y < height; y++) {
        for (int x = 0; x < width; x++) {
            Vec pos = { x, y };
            xmasCount += countXmasAt(grid, pos);
        }
    }

    printf("XMAS Count: %d\n", xmasCount);

    return 0;
}
