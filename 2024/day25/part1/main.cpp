#include <cstdint>
#include <iostream>
#include <fstream>
#include <array>
#include <vector>

using namespace std;

array<uint8_t, 5> parse(const array<string, 7> &grid) {
    bool isLock = grid[0][0] == '#';

    array<uint8_t, 5> heights;
    for (int i = 0; i < 5; i++) {
        uint8_t columnHeight = 0;
        if (isLock) {
            while (grid[columnHeight + 1][i] == '#') {
                columnHeight++;
            }
        } else {
            while (grid[5 - columnHeight][i] == '#') {
                columnHeight++;
            }
        }
        heights[i] = columnHeight;
    }
    return heights;
}

bool couldFit(const array<uint8_t, 5> &lock, const array<uint8_t, 5> &key) {
    for (int i = 0; i < 5; i++) {
        if (lock[i] + key[i] > 5) return false;
    }
    return true;
}

void print(const array<uint8_t, 5> &heights) {
    cout << "- ";
    for (uint8_t height : heights) {
        cout << (int) height;
    }
    cout << endl;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    vector<array<uint8_t, 5>> locks;
    vector<array<uint8_t, 5>> keys;

    string line;
    do {
        array<string, 7> grid;
        for (int i = 0; i < 7; i++) {
            getline(inputFile, line);
            grid[i] = line;
            cout << "> " << line << endl;
        }

        array<uint8_t, 5> heights = parse(grid);
        print(heights);

        if (grid[0][0] == '#') {
            locks.push_back(heights);
        } else {
            keys.push_back(heights);
        }
        cout << "=======" << endl;
    } while (getline(inputFile, line));

    cout << "Parsed " << locks.size() << " locks and " << keys.size() << " keys." << endl;

    int fittingPairs = 0;
    for (const array<uint8_t, 5> lock : locks) {
        for (const array<uint8_t, 5> key : keys) {
            if (couldFit(lock, key)) {
                fittingPairs++;
            }
        }
    }

    cout << "Number of lock/key pairs that can fit together: " << fittingPairs << endl;
}
