#include <iostream>
#include <fstream>
#include <set>
#include <string>
#include <regex>
#include <cmath>

using namespace std;

struct Gate {
    enum Type { AND, OR, XOR, INPUT, OUTPUT };

    int id;
    Type type;
    string inA, inB, out;

    string typeAsString() const {
        if (type == AND) return "AND";
        if (type == OR) return "OR";
        if (type == XOR) return "XOR";
        if (type == INPUT) return "INPUT";
        return "OUTPUT";
    }
};

bool operator<(const Gate &g1, const Gate &g2) {
    if (g1.type != g2.type) return g1.type < g2.type;
    if (g1.inA != g2.inA) return g1.inA < g2.inA;
    if (g1.inB != g2.inB) return g1.inB < g2.inB;
    if (g1.out != g2.out) return g1.out < g2.out;
    return false;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    set<Gate> gates;
    set<string> wires;

    int nodeId = 0;
    string line;
    // Parsing initial wire states
    while (getline(inputFile, line) && line.length() != 0) {
        string wireName { line.substr(0, 3) };
        wires.insert(wireName);
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
                .id = nodeId++,
                .type = type == "AND" ? Gate::Type::AND : type == "OR" ? Gate::Type::OR : Gate::Type::XOR,
                .inA = inA,
                .inB = inB,
                .out = out
                });
        if (wires.find(inA) == wires.end()) wires.insert(inA);
        if (wires.find(inB) == wires.end()) wires.insert(inB);
        if (wires.find(out) == wires.end()) wires.insert(out);
    }

    // Adding input and output dummy nodes for input and output edges to connect to
    for (string name : wires) {

        if (name[0] == 'z') {
            gates.insert(Gate{
                    .id = nodeId++,
                    .type = Gate::OUTPUT,
                    .inA = name
                    });
        }
        if (name[0] == 'x' || name[0] == 'y') {
            gates.insert(Gate{
                    .id = nodeId++,
                    .type = Gate::INPUT,
                    .out = name
                    });
        }
    }

    ofstream nodes ("part2/nodes.csv");
    nodes << "Id,Label" << endl;
    for (const Gate &gate : gates) {
        string label = gate.typeAsString();
        nodes << gate.id << "," << label << endl;
    }
    nodes.close();

    ofstream edges ("part2/edges.csv");
    int edgeId = 0;
    edges << "Source,Target,Type,Id,Label" << endl;
    for (string name : wires) {
        for (const Gate &from : gates) {
            if (from.out == name) {
                for (const Gate &to : gates) {
                    if (to.inA == name || to.inB == name) {
                        edges << from.id << "," << to.id << ",Directed," << edgeId++ << "," << name << endl;
                    }
                }
                break;
            }
        }
    }
    edges.close();
}
