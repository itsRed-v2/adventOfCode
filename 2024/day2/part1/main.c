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

int isSafe(char* line) {
    // Parsing
    int spaceCount = 0;
    for (int i = 0; i < strlen(line); i++) {
        if (line[i] == ' ') spaceCount++;
    }
    int length = spaceCount + 1;

    int* values = malloc(length * sizeof(int));

    for (int i = 0; i < length; i++) {
        sscanf(line, "%d", values + i);
        while (line[0] != ' ' && line[0] != '\0') {
            line++;
        }
        line++;
    }

    // Safe checking

    // (assuming length cannot be 1)
    char isDecreasing;
    if (values[0] > values[1]) isDecreasing = TRUE;
    else if (values[0] < values[1]) isDecreasing = FALSE;
    else if (values[0] == values[1]) return FALSE; // If two values are equal, report is unsafe

    for (int i = 0; i < length - 1; i++) {
        int difference = values[i+1] - values[i];
        if (difference == 0) return FALSE;
        if (isDecreasing && (difference < -3 || difference > 0)) return FALSE;
        if (!isDecreasing && (difference > 3 || difference < 0)) return FALSE;
    }

    return TRUE;
}

int main() {
    FILE* input = getinput("input.txt");

    int safeCount = 0;
    char* line;
    while (strlen(line = readline(input))) {
        if (isSafe(line)) safeCount++;
        free(line);
    }

    printf("Number of safe reports: %d\n", safeCount);
    return 0;
}

