#include <cmath>
#include <cstdint>
#include <iostream>
#include <fstream>
#include <regex>
#include <sstream>

using namespace std;

struct ClawMachine {
    int Ax;
    int Ay;
    int Bx;
    int By;
    uint64_t PrizeX;
    uint64_t PrizeY;
};

uint64_t computeMinimumTokenCount(const ClawMachine &m) {
    int64_t dividend = m.PrizeX * m.Ay - m.PrizeY * m.Ax;
    int64_t divisor = m.Bx * m.Ay - m.By * m.Ax;
    if (dividend % divisor != 0) return 0;
    int64_t Bpresses = dividend / divisor;

    if ((m.PrizeY - Bpresses * m.By) % m.Ay != 0) return 0;
    int64_t Apresses = (m.PrizeY - Bpresses * m.By) / m.Ay;

    return Bpresses + Apresses * 3;
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

    regex machineRegex("Button A: X\\+(\\d+), Y\\+(\\d+)\\n"
            "Button B: X\\+(\\d+), Y\\+(\\d+)\\n"
            "Prize: X=(\\d+), Y=(\\d+)");

    sregex_iterator matchBegin { sregex_iterator(input.begin(), input.end(), machineRegex) };
    sregex_iterator matchEnd { sregex_iterator() };

    cout << "Found " << distance(matchBegin, matchEnd) << " machines" << endl;

    uint64_t totalTokensNeeded = 0;

    int machineNumber { 1 };
    for (sregex_iterator it = matchBegin; it != matchEnd; it++) {
        smatch match { *it };

        ClawMachine machine {
            .Ax = stoi(match.str(1)),
            .Ay = stoi(match.str(2)),
            .Bx = stoi(match.str(3)),
            .By = stoi(match.str(4)),
            .PrizeX = stoull(match.str(5)) + 10000000000000,
            .PrizeY = stoull(match.str(6)) + 10000000000000,
        };

        uint64_t tokensNeeded { computeMinimumTokenCount(machine) };
        if (tokensNeeded == 0) {
            cout << "Machine " << machineNumber << ": Impossible to get prize." << endl;
        } else {
            cout << "Machine " << machineNumber << ": " << tokensNeeded << " tokens needed." << endl;
        }
        totalTokensNeeded += tokensNeeded;

        machineNumber++;
    }

    cout << "Minimum token count to get all possible prizes: " << totalTokensNeeded << endl;
}
