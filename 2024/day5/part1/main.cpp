#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

class OrderingRule {
public:
    int before;
    int after;

    OrderingRule(string data) {
        before = stoi(data.substr(0, 2));
        after = stoi(data.substr(3, 2));
    }

    bool shouldBeIgnoredFor(const vector<int> &update) const {
        if (find(update.cbegin(), update.cend(), before) == update.cend()) return true;
        if (find(update.cbegin(), update.cend(), after) == update.cend()) return true;
        return false;
    }

    bool verifyUpdate(const vector<int> &update) const {
        if (shouldBeIgnoredFor(update)) return true;

        vector<int>::const_iterator i1 { find(update.cbegin(), update.cend(), before) };
        vector<int>::const_iterator i2 { find(update.cbegin(), update.cend(), after) };
        return i1 < i2;
    }
};

bool isUpateOrdered(const vector<OrderingRule> &rules, const vector<int> &update) {
    for (const OrderingRule &rule : rules) {
        if (!rule.verifyUpdate(update)) return false;
    }
    return true;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    vector<OrderingRule> rules;
    string line;
    while (getline(inputFile, line) && line != "") {
        rules.push_back(OrderingRule(line));
    }

    int total = 0;
    while (getline(inputFile, line)) {
        vector<int> update;
        for (int i = 0; i < line.length(); i += 3) {
            update.push_back(stoi(line.substr(i, 2)));
        }

        if (isUpateOrdered(rules, update)) {
            int middle = update[update.size() / 2];
            total += middle;
        }
    }

    cout << "Total: " << total << endl;
}
