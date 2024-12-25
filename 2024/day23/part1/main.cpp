#include <iostream>
#include <fstream>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <set>

using namespace std;

vector<string> getNeighbors(string computer, const unordered_multimap<string, string> &connections) {
    auto range { connections.equal_range(computer) };
    vector<string> neighbors;
    for (auto it = range.first; it != range.second; it++) {
        neighbors.push_back(it->second);
    }
    return neighbors;
}

template<class T>
vector<pair<T, T>> pairs(const vector<T> &list) {
    vector<pair<T, T>> pairs;
    for (int i = 0; i < list.size() - 1; i++) {
        for (int j = i + 1; j < list.size(); j++) {
            pairs.push_back(pair{list[i], list[j]});
        }
    }
    return pairs;
}

bool connectionExists(string computer1, string computer2, const unordered_multimap<string, string> &connections) {
    auto range { connections.equal_range(computer1) };
    for (auto it = range.first; it != range.second; it++) {
        if (it->second == computer2) return true;
    }
    return false;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    unordered_multimap<string, string> connections;
    unordered_set<string> computers;

    string line;
    while (getline(inputFile, line)) {
        string computer1 { line.substr(0, 2) };
        string computer2 { line.substr(3, 2) };
        connections.insert({computer1, computer2});
        connections.insert({computer2, computer1});
        computers.insert(computer1);
        computers.insert(computer2);
    }

    cout << computers.size() << " computers registered" << endl;

    set<set<string>> setsOfThree;

    for (const string &computer : computers) {
        vector<string> neighbors { getNeighbors(computer, connections) };
        for (const pair<string, string> &neighborPair : pairs(neighbors)) {
            if (connectionExists(neighborPair.first, neighborPair.second, connections)) {
                setsOfThree.insert(set{computer, neighborPair.first, neighborPair.second});
            }
        }
    }

    cout << setsOfThree.size() << " sets of three inter-connected computers found" << endl;

    int interestingSetCount { 0 };
    for (const set<string> &setOfThree : setsOfThree) {
        for (string computer : setOfThree) {
            if (computer[0] == 't') {
                interestingSetCount++;
                break;
            }
        }
    }

    cout << "Number of sets of three inter-connected computers with at least one of them with a name that starts with 't': " << interestingSetCount << endl;

}
