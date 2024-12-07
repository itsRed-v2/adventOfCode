#include <cstdint>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>

using namespace std;

enum Operation {
    ADDITION,
    MULTIPLICATION
};

class Equation {
public:
    uint64_t testValue;
    vector<uint32_t> numbers;

    Equation(string inputLine) {
        testValue = stoll(inputLine.substr(0, inputLine.find(':')));

        string remaining { inputLine.substr(inputLine.find(':') + 2) };
        while (true) {
            string value { remaining.substr(0, remaining.find(' ')) };
            numbers.push_back(stoi(value));

            if (remaining.find(' ') == remaining.npos) break;
            remaining = remaining.substr(remaining.find(' ') + 1);
        }
    }

    bool isPossible() const {
        vector<Operation> startingVector;
        return generateOperations(startingVector);
    }

private:
    bool generateOperations(vector<Operation> currentOperations) const {
        if (currentOperations.size() == numbers.size() - 1) {
            return checkAgainstOperationList(currentOperations);
        } else {
            currentOperations.push_back(ADDITION);
            if (generateOperations(currentOperations)) return true;
            currentOperations.back() = MULTIPLICATION;
            if (generateOperations(currentOperations)) return true;
            return false;
        }
    }

    bool checkAgainstOperationList(vector<Operation> operations) const {
        uint64_t current = numbers[0];
        for (int i = 1; i < numbers.size(); i++) {
            if (operations[i-1] == ADDITION) {
                current += numbers[i];
            } else {
                current *= numbers[i];
            }
        }
        return current == testValue;
    }
};

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    vector<Equation> equations;

    string line;
    while (getline(inputFile, line)) {
        equations.push_back(Equation(line));
    }

    uint64_t total { 0 };
    for (int i = 0; i < equations.size(); i++) {
        cout << "Processing equation " << i + 1 << " / " << equations.size() << endl;

        const Equation &eq { equations[i] };
        if (eq.isPossible()) total += eq.testValue;
    }

    cout << "Total calibration result: " << total << endl;

    return 0;
}
