#include <iostream>
#include <fstream>
#include <string>
#include <vector>

using namespace std;

bool startsWith(const string &str, const string &substr) {
    if (str.length() < substr.length()) return false;
    return str.compare(0, substr.length(), substr) == 0;
}

bool isDesignPossible(const string &design, const vector<string> &towels) {
    if (design.length() == 0) return true;

    for (const string &towel : towels) {
        if (startsWith(design, towel)) {
            string remaining { design.begin() + towel.length(), design.end() };
            if (isDesignPossible(remaining, towels)) return true;
        }
    }
    return false;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    string firstLine;
    getline(inputFile, firstLine);
    vector<string> availableTowels;
    string currentTowel { "" };
    for (const char c : firstLine) {
        if (c == ',') {
            availableTowels.push_back(currentTowel);
            currentTowel = "";
        }
        else if (c == ' ') continue;
        else {
            currentTowel.push_back(c);
        }
    }
    availableTowels.push_back(currentTowel); // Push the last towel which doesn't have a ',' after it.

    int possibleDesignCount { 0 };
    string design;
    getline(inputFile, design); // Comsume the empty line

    while (getline(inputFile, design)) {
        if (isDesignPossible(design, availableTowels)) {
            possibleDesignCount++;
        }
    }

    cout << "Number of possible designs: " << possibleDesignCount << endl;
}
