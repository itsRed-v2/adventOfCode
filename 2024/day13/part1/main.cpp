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
    int PrizeX;
    int PrizeY;
};

int computeMinimumTokenCount(const ClawMachine &machine) {
    for (int Bpresses = 100; Bpresses >= 0; Bpresses--) {
        int remainingX = machine.PrizeX - Bpresses * machine.Bx;
        int remainingY = machine.PrizeY - Bpresses * machine.By;
        int Apresses { remainingX / machine.Ax };
        if (Apresses * machine.Ax == remainingX && Apresses * machine.Ay == remainingY) {
            return Bpresses + Apresses * 3;
        }
    }
    return 0;
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

    unsigned long totalTokensNeeded = 0;

    for (sregex_iterator it = matchBegin; it != matchEnd; it++) {
        smatch match { *it };

        ClawMachine machine {
            .Ax = stoi(match.str(1)),
            .Ay = stoi(match.str(2)),
            .Bx = stoi(match.str(3)),
            .By = stoi(match.str(4)),
            .PrizeX = stoi(match.str(5)),
            .PrizeY = stoi(match.str(6)),
        };

        totalTokensNeeded += computeMinimumTokenCount(machine);
    }

    cout << "Minimum token count to get all possible prizes: " << totalTokensNeeded << endl;
}
