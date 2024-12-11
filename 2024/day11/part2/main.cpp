#include <cstddef>
#include <cstdint>
#include <fstream>
#include <iostream>
#include <string>
#include <unordered_map>

using namespace std;

#define BLINK_COUNT 75

template<>
struct std::hash<pair<uint64_t, int>> {
    size_t operator()(const pair<uint64_t, int> &pair) const {
        return 7 * pair.first + 13 * pair.second;
    }
};

uint64_t calculateStoneCount(uint64_t stone, int remainingBlinks);

uint64_t getStoneCount(uint64_t stone, int remainingBlinks) {
    static unordered_map<pair<uint64_t, int>, uint64_t> cache;

    pair<uint64_t, int> key { stone, remainingBlinks };
    if (cache.find(key) != cache.end()) {
        return cache.at(key);
    } else {
        uint64_t stoneCount { calculateStoneCount(stone, remainingBlinks) };
        cache.insert({ key, stoneCount });
        return stoneCount;
    }
}

uint64_t calculateStoneCount(uint64_t stone, int remainingBlinks) {
    if (remainingBlinks == 0) return 1;

    if (stone == 0) return getStoneCount(1, remainingBlinks - 1);

    if (to_string(stone).length() % 2 == 0) {
        string stonestr { to_string(stone) };
        int halfLength { (int) stonestr.length() / 2 };

        int first { stoi(stonestr.substr(0, halfLength)) };
        int second { stoi(stonestr.substr(halfLength, halfLength)) };

        return getStoneCount(first, remainingBlinks - 1) + getStoneCount(second, remainingBlinks - 1);
    }

    return getStoneCount(stone * 2024, remainingBlinks - 1);
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    string line;
    getline(inputFile, line);

    uint64_t stoneCount { 0 };
    string currentNumber {};
    for (const char &c : line) {
        if (c == ' ') {
            stoneCount += getStoneCount(stoi(currentNumber), BLINK_COUNT);
            currentNumber = "";
        } else {
            currentNumber.append(1, c);
        }
    }
    stoneCount += getStoneCount(stoi(currentNumber), BLINK_COUNT);

    cout << "Stone count after " << BLINK_COUNT << " blinks: " << stoneCount << endl;
}
