#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <regex.h>

char* getinput(char* filename) {
    FILE* file = fopen(filename, "r");

    if (file == NULL) {
        printf("Error in reading file %s\n", filename);
        exit(1);
    }

    fseek(file, 0, SEEK_END);
    int length = ftell(file);
    rewind(file);
    char* input = malloc((length + 1) * sizeof(char));
    fread(input, length, 1, file);
    input[length] = '\0';
    return input;
}

int sumMul(char* start, regex_t mulregex) {
    int sum = 0;

    char* current = start;
    regmatch_t mulmatch[3];
    while (regexec(&mulregex, current, 3, mulmatch, 0) == 0) {
        int n1, n2;
        sscanf(current + mulmatch[1].rm_so, "%d", &n1);
        sscanf(current + mulmatch[2].rm_so, "%d", &n2);
        sum += n1 * n2;

        current += mulmatch[0].rm_eo;
    }

    return sum;
}

int main() {
    char* input = getinput("input.txt");

    regex_t mulregex, dontregex, doregex;
    int err;
    err = regcomp(&mulregex, "mul\\(([0-9]+),([0-9]+)\\)", REG_EXTENDED);
    err |= regcomp(&dontregex, "don't\\(\\)", REG_EXTENDED);
    err |= regcomp(&doregex, "do\\(\\)", REG_EXTENDED);

    if (err != 0) {
        printf("Error when compiling regexp.\n");
        exit(1);
    }

    int sum = 0;

    char* current = input;
    while (1) {
        regmatch_t dontmatch[1];
        int fail = regexec(&dontregex, current, 1, dontmatch, 0);
        if (fail) {
            sum += sumMul(current, mulregex);
            break;
        }

        current[dontmatch[0].rm_so] = '\0';

        sum += sumMul(current, mulregex);

        current += dontmatch[0].rm_eo;

        regmatch_t domatch[1];
        fail = regexec(&doregex, current, 1, domatch, 0);
        if (fail) break;

        current += domatch[0].rm_eo;
    }

    printf("Sum of mult: %d\n", sum);

    free(input);
    regfree(&mulregex);
    regfree(&dontregex);
    regfree(&doregex);
    return 0;
}
