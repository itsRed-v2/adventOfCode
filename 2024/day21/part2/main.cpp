#include <cstddef>
#include <cstdint>
#include <iostream>
#include <fstream>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

using namespace std;

struct Vec {
    int x, y;
};

Vec operator-(const Vec &v1, const Vec &v2) {
    return Vec{v1.x - v2.x, v1.y - v2.y};
}

Vec operator+(const Vec &v1, const Vec &v2) {
    return Vec{v1.x + v2.x, v1.y + v2.y};
}

class Keypad {
    const vector<string> keys;

public:
    Keypad(vector<string> keys) : keys(keys) {}

    Vec getKeyPos(char key) const {
        for (int y = 0; y < keys.size(); y++) {
            for (int x = 0; x < keys[0].length(); x++) {
                if (keys[y][x] == key)
                    return Vec{x, y};
            }
        }
        throw runtime_error("Key not present on keypad");
    }

    char getKeyAt(Vec pos) const {
        if (pos.x < 0 || pos.x >= keys[0].length()
                || pos.y < 0 || pos.y >= keys.size()) {
            throw runtime_error("Position out of keypad.");
        }
        return keys[pos.y][pos.x];
    }
};

uint64_t sequenceToGoFrom(char key1, char key2, vector<Keypad> keypads);

uint64_t sequenceFor(const string &code, const vector<Keypad> &keypads) {
    if (keypads.empty()) return code.size();

    uint64_t seqLength { 0 };
    for (int i = 0; i < code.length(); i++) {
        char from = i == 0 ? 'A' : code[i-1];
        char to = code[i];
        seqLength += sequenceToGoFrom(from, to, keypads);
    }
    return seqLength;
}

uint64_t sequenceToGoFrom(char key1, char key2, vector<Keypad> keypads) {
    static unordered_map<string, uint64_t> memoisedPaths;

    string pathHash { to_string(keypads.size()) + key1 + key2 };
    if (memoisedPaths.find(pathHash) != memoisedPaths.end()) {
        return memoisedPaths.at(pathHash);
    }

    Keypad keypad = keypads.back();
    keypads.pop_back();
    Vec pos1 { keypad.getKeyPos(key1) };
    Vec pos2 { keypad.getKeyPos(key2) };

    Vec travel { pos2 - pos1 };

    uint64_t result;

    if (travel.x == 0 && travel.y == 0) {
        result = string("A").length();
    } else if (travel.x == 0 && travel.y != 0) {
        string sequence = travel.y > 0 ? string(travel.y, 'v') : string(-travel.y, '^');
        sequence += 'A';
        result = sequenceFor(sequence, keypads);
    } else if (travel.x != 0 && travel.y == 0) {
        string sequence = travel.x > 0 ? string(travel.x, '>') : string(-travel.x, '<');
        sequence += 'A';
        result = sequenceFor(sequence, keypads);
    } else {
        Vec verticalMidPoint { pos1 + Vec{0, travel.y} };
        Vec horizontalMidPoint { pos1 + Vec{travel.x, 0} };
        bool verticalAllowed = keypad.getKeyAt(verticalMidPoint) != ' ';
        bool horizontalAllowed = keypad.getKeyAt(horizontalMidPoint) != ' ';

        uint64_t verticalSeqLength, horizontalSeqLength;
        if (verticalAllowed) {
            string sequence = travel.y > 0 ? string(travel.y, 'v') : string(-travel.y, '^');
            sequence += travel.x > 0 ? string(travel.x, '>') : string(-travel.x, '<');
            sequence += 'A';
            verticalSeqLength = sequenceFor(sequence, keypads);
        }
        if (horizontalAllowed) {
            string sequence = travel.x > 0 ? string(travel.x, '>') : string(-travel.x, '<');
            sequence += travel.y > 0 ? string(travel.y, 'v') : string(-travel.y, '^');
            sequence += 'A';
            horizontalSeqLength = sequenceFor(sequence, keypads);
        }

        if (!verticalAllowed) result = horizontalSeqLength;
        else if (!horizontalAllowed) result = verticalSeqLength;
        else result = verticalSeqLength < horizontalSeqLength ? verticalSeqLength : horizontalSeqLength;
    }

    memoisedPaths.insert({pathHash, result});
    return result;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    const Keypad numericKeypad({
            "789",
            "456",
            "123",
            " 0A",
            });
    const Keypad directionalKeypad({
            " ^A",
            "<v>",
            });

    vector<Keypad> keypads(25, directionalKeypad);
    keypads.push_back(numericKeypad);

    uint64_t complexitySum { 0 };
    string code;
    while (getline(inputFile, code)) {
        uint64_t sequenceLength { sequenceFor(code, keypads) };
        cout << code << endl;

        uint64_t numericPart { stoull(code.substr(0, 3)) };
        uint64_t complexity { sequenceLength * numericPart };
        complexitySum += complexity;

        cout << "This sequence has complexity " << sequenceLength
            << " * " << numericPart << " = " << complexity << endl;
        cout << endl;
    }

    cout << "Sum of complexities: " << complexitySum << endl;
}
