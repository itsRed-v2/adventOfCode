#include <cstdint>
#include <iostream>
#include <fstream>
#include <string>
#include <unordered_map>
#include <vector>

using namespace std;

bool startsWith(const string &str, const string &substr) {
    if (str.length() < substr.length()) return false;
    return str.compare(0, substr.length(), substr) == 0;
}

uint64_t countWaysForDesign(const string &design, const vector<string> &towels, unordered_map<string, uint64_t> &designMap) {
    if (designMap.find(design) != designMap.end()) {
        return designMap.at(design);
    }

    //cout << design << endl;
    if (design.length() == 0) return 1;

    uint64_t ways { 0 };
    for (const string &towel : towels) {
        if (startsWith(design, towel)) {
            string remaining { design.begin() + towel.length(), design.end() };
            ways += countWaysForDesign(remaining, towels, designMap);
        }
    }

    designMap.insert({design, ways});
    return ways;
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

    uint64_t totalDesignPossibilities { 0 };
    string design;
    getline(inputFile, design); // Comsume the empty line

    unordered_map<string, uint64_t> designMap;

    while (getline(inputFile, design)) {
        //cout << "Processing design: '" << design << "'" << endl;
        totalDesignPossibilities += countWaysForDesign(design, availableTowels, designMap);
    }

    cout << "Sum of ways to make each design: " << totalDesignPossibilities << endl;
}
