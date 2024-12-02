#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#define TRUE 1
#define FALSE 0

FILE* getinput(char* filename) {
    FILE* file = fopen(filename, "r");

    if (file == NULL) {
        printf("Error in reading file %s\n", filename);
        exit(1);
    }

    return file;
}

char* readline(FILE* file) {
    int maxLineLength = 100;
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

char isSafe(int* levels, int reportLength) {
    // (assuming length cannot be 1)
    char isDecreasing;
    if (levels[0] > levels[1]) isDecreasing = TRUE;
    else if (levels[0] < levels[1]) isDecreasing = FALSE;
    else if (levels[0] == levels[1]) return FALSE; // If two levels are equal, report is unsafe

    for (int i = 0; i < reportLength - 1; i++) {
        int difference = levels[i+1] - levels[i];
        if (difference == 0) return FALSE;
        if (isDecreasing && (difference < -3 || difference > 0)) return FALSE;
        if (!isDecreasing && (difference > 3 || difference < 0)) return FALSE;
    }
    return TRUE;
}

char isLineSafeWithDampener(char* line) {
    // Parsing
    int spaceCount = 0;
    for (int i = 0; i < strlen(line); i++) {
        if (line[i] == ' ') spaceCount++;
    }
    int length = spaceCount + 1;

    int levels[length];

    for (int i = 0; i < length; i++) {
        sscanf(line, "%d", levels + i);
        while (line[0] != ' ' && line[0] != '\0') {
            line++;
        }
        line++;
    }

    // Safe checking
    for (int i = 0; i < length; i++) {
        int levelsWithOneRemoved[length - 1];
        int appendIndex = 0;
        for (int j = 0; j < length; j++) {
            if (j != i) {
                levelsWithOneRemoved[appendIndex++] = levels[j];
            }
        }

        if (isSafe(levelsWithOneRemoved, length - 1))
            return TRUE;
    }

    return FALSE;
}

int main() {
    FILE* input = getinput("input.txt");

    int safeCount = 0;
    char* line;
    while (strlen(line = readline(input))) {
        if (isLineSafeWithDampener(line)) safeCount++;
        free(line);
    }

    printf("Number of safe reports: %d\n", safeCount);
    return 0;
}

