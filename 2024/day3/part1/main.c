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

int main() {
    char* input = getinput("input.txt");

    regex_t regex;
    int err;
    err = regcomp(&regex, "mul\\(([0-9]+),([0-9]+)\\)", REG_EXTENDED);

    if (err != 0) {
        printf("Error when compiling regexp.\n");
        exit(1);
    }

    int sum = 0;

    const char* current = input;
    regmatch_t pmatch[3];
    while (1) {
        err = regexec(&regex, current, 3, pmatch, 0);

        if (err == REG_NOMATCH) break;
        if (err != 0) {
            printf("Error when executing regex. Code: %d\n", err);
            break;
        }

        printf("Match: '%.*s', '%.*s', '%.*s'\n",
                pmatch[0].rm_eo - pmatch[0].rm_so,
                current + pmatch[0].rm_so,
                pmatch[1].rm_eo - pmatch[1].rm_so,
                current + pmatch[1].rm_so,
                pmatch[2].rm_eo - pmatch[2].rm_so,
                current + pmatch[2].rm_so);

        int n1, n2;
        sscanf(current + pmatch[1].rm_so, "%d", &n1);
        sscanf(current + pmatch[2].rm_so, "%d", &n2);
        sum += n1 * n2;

        current += pmatch[0].rm_eo;
    }

    printf("Sum of mult: %d\n", sum);

    free(input);
    regfree(&regex);
    return 0;
}
