#include <cstdint>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>

using namespace std;

#define BLINK_COUNT 25

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    vector<uint64_t> stones;

    string currentNumber {};
    string line;
    getline(inputFile, line);
    for (const char &c : line) {
        if (c == ' ') {
            stones.push_back(stoi(currentNumber));
            currentNumber = "";
        } else {
            currentNumber.append(1, c);
        }
    }
    stones.push_back(stoi(currentNumber));

    for (int i { 0 }; i < BLINK_COUNT; i++) {
        for (int j { 0 }; j < stones.size(); j++) {
            if (stones[j] == 0) stones[j] = 1;
            else if (to_string(stones[j]).length() % 2 == 0) {
                string stonestr { to_string(stones[j]) };
                int halfLength { (int) stonestr.length() / 2 };

                int first { stoi(stonestr.substr(0, halfLength)) };
                int second { stoi(stonestr.substr(halfLength, halfLength)) };

                stones[j] = first;
                j++;
                stones.insert(stones.begin() + j, second);
            } else {
                stones[j] *= 2024;
            }
        }
    }

    cout << "Stone count after " << BLINK_COUNT << " blinks: " << stones.size() << endl;
}
