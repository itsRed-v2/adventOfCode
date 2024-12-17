#include <cmath>
#include <cstdint>
#include <iostream>
#include <fstream>
#include <regex>
#include <sstream>
#include <stdexcept>
#include <string>

using namespace std;

uint64_t evaluateCombo(uint64_t A, uint64_t B, uint64_t C, char operand) {
    switch (operand) {
        case 0:
        case 1:
        case 2:
        case 3:
            return operand;
        case 4:
            return A;
        case 5:
            return B;
        case 6:
        case 7:
            return C;
    }
    throw runtime_error("Invalid combo operand value: " + to_string(operand));
}

vector<char> run(uint64_t A, uint64_t B, uint64_t C, const vector<char> &program) {
    vector<char> output;
    int instructionPointer { 0 };

    while (instructionPointer < program.size()) {
        char opcode { program[instructionPointer++] };
        char operand { program[instructionPointer++] };
        uint64_t combo { evaluateCombo(A, B, C, operand) };

        switch (opcode) {
            case 0: // adv
                A = A / pow(2, combo);
                break;
            case 1: // bxl
                B = B ^ operand;
                break;
            case 2: // bst
                B = combo % 8;
                break;
            case 3: // jnz
                if (A != 0) instructionPointer = operand;
                break;
            case 4: // bxc
                B = B ^ C;
                break;
            case 5: // out
                output.push_back(combo % 8);
                break;
            case 6: // bdv
                B = A / pow(2, combo);
                break;
            case 7: // cdv
                C = A / pow(2, combo);
                break;
            default:
                throw runtime_error("Unknown opcode");
        }
    }

    return output;
}

int nextInt(sregex_iterator &matchIt) {
    smatch match { *matchIt };
    matchIt++;
    return stoi(match.str());
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    stringstream buffer;
    buffer << inputFile.rdbuf();
    string input { buffer.str() };

    regex numberRegex("\\d+");

    sregex_iterator matchIt { sregex_iterator(input.begin(), input.end(), numberRegex) };
    sregex_iterator matchEnd { sregex_iterator() };

    uint64_t regA = nextInt(matchIt);
    uint64_t regB = nextInt(matchIt);
    uint64_t regC = nextInt(matchIt);
    vector<char> program;

    cout << "Registers: " << regA << ", " << regB << ", " << regC << endl;

    while (matchIt != matchEnd) {
        char code { static_cast<char>(nextInt(matchIt)) };
        program.push_back(code);
    }

    vector<char> output { run(regA, regB, regC, program) };

    cout << "Output: ";
    for (const char octalNumber: output) {
        cout << (int) octalNumber << ",";
    }
    cout << endl;
}
