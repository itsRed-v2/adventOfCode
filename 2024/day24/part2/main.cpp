#include <bitset>
#include <cstdint>
#include <iostream>
#include <fstream>
#include <map>
#include <set>
#include <string>
#include <regex>
#include <cmath>

using namespace std;

struct Gate {
    enum Type { AND, OR, XOR };

    Type type;
    string inA, inB, out;
};

bool operator<(const Gate &g1, const Gate &g2) {
    if (g1.type != g2.type) return g1.type < g2.type;
    if (g1.inA != g2.inA) return g1.inA < g2.inA;
    if (g1.inB != g2.inB) return g1.inB < g2.inB;
    if (g1.out != g2.out) return g1.out < g2.out;
    return false;
}

enum WireState {
    UNSET, ONE, ZERO
};

WireState gateAnd(WireState s1, WireState s2) {
    return s1 == ONE && s2 == ONE ? ONE : ZERO;
}

WireState gateOr(WireState s1, WireState s2) {
    return s1 == ONE || s2 == ONE ? ONE : ZERO;
}

WireState gateXor(WireState s1, WireState s2) {
    return s1 != s2 ? ONE : ZERO;
}

bool unsetWiresRemaining(const map<string, WireState> &wires) {
    return find_if(wires.begin(), wires.end(), [](const auto entry) -> bool {
            return entry.second == WireState::UNSET;
        }) != wires.end();
}

uint64_t readValue(char firstChar, const map<string, WireState> &wires) {
    uint64_t formedValue = 0;
    for (const auto &entry : wires) {
        string wireName { entry.first };
        if (wireName[0] != firstChar) continue;

        if (entry.second == WireState::ONE) {
            int wireNumber { stoi(wireName.substr(1, 2)) };
            formedValue += (uint64_t) pow(2, wireNumber);
        }
    }
    return formedValue;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    set<Gate> gates;
    map<string, WireState> wires;

    string line;
    // Parsing initial wire states
    while (getline(inputFile, line) && line.length() != 0) {
        string wireName { line.substr(0, 3) };
        WireState state { line[5] == '0' ? WireState::ZERO : WireState::ONE };
        wires.insert({wireName, state});
    }

    // Parsing gates
    regex gateRegex("(...) (AND|OR|XOR) (...) -> (...)");
    while (getline(inputFile, line)) {
        smatch match;
        regex_search(line, match, gateRegex);
        string inA { match.str(1) };
        string type { match.str(2) };
        string inB { match.str(3) };
        string out { match.str(4) };
        gates.insert(Gate{
                .type = type == "AND" ? Gate::Type::AND : type == "OR" ? Gate::Type::OR : Gate::Type::XOR,
                .inA = inA,
                .inB = inB,
                .out = out
                });
        if (wires.find(inA) == wires.end()) wires.insert({inA, WireState::UNSET});
        if (wires.find(inB) == wires.end()) wires.insert({inB, WireState::UNSET});
        if (wires.find(out) == wires.end()) wires.insert({out, WireState::UNSET});
    }

    while (unsetWiresRemaining(wires)) {
        for (const Gate &gate : gates) {
            if (wires.at(gate.out) != UNSET) continue;
            if (wires.at(gate.inA) != UNSET && wires.at(gate.inB) != UNSET) {
                if (gate.type == Gate::AND)
                    wires.at(gate.out) = gateAnd(wires.at(gate.inA), wires.at(gate.inB));
                else if (gate.type == Gate::OR)
                    wires.at(gate.out) = gateOr(wires.at(gate.inA), wires.at(gate.inB));
                else if (gate.type == Gate::XOR)
                    wires.at(gate.out) = gateXor(wires.at(gate.inA), wires.at(gate.inB));
            }
        }
    }

    uint64_t x = readValue('x', wires);
    uint64_t y = readValue('y', wires);
    uint64_t z = readValue('z', wires);

    bitset<64> effectiveZ(z);
    bitset<64> expectedZ(x+y);

    string wireNameLine1;
    string wireNameLine2;
    string wireNameLine3;
    for (int i = 63; i >= 0; i--) {
        wireNameLine1 += "z";
        wireNameLine2 += to_string(i / 10);
        wireNameLine3 += to_string(i % 10);
    }

    cout << "Wire name : " << wireNameLine1 << endl;
    cout << "            " << wireNameLine2 << endl;
    cout << "            " << wireNameLine3 << endl;
    cout << "Computed Z: " << effectiveZ << endl;
    cout << "Expected Z: " << expectedZ << endl;
}
