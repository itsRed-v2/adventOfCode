#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

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

int compareInt(const void* n1, const void* n2) {
	int intN1 = *((const int*) n1);
	int intN2 = *((const int*) n2);
	return intN1 - intN2;
}

int main() {
	FILE* input = fopen("input.txt", "r");

	if (input == NULL) {
		printf("Error in reading input\n");
		exit(1);
	}

	int list1[1000], list2[1000];
	int listLength = 0;

	char* line = readline(input);
	while(strlen(line)) {
		int n1, n2;
		sscanf(line, "%d   %d", &n1, &n2);
		list1[listLength] = n1;
		list2[listLength] = n2;
		listLength++;

		line = readline(input);
	}

	qsort(list1, listLength, sizeof(int), compareInt);
	qsort(list2, listLength, sizeof(int), compareInt);

	long totalDistance = 0;
	for (int i = 0; i < listLength; i++) {
		totalDistance += abs(list1[i] - list2[i]);
	}
	printf("Total distance: %ld\n", totalDistance);

	return 0;
}

