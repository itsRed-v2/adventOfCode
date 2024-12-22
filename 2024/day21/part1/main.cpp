#include <iostream>
#include <fstream>
#include <stdexcept>
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

string sequenceToGoFrom(char key1, char key2, vector<Keypad> keypads);

string sequenceFor(string code, vector<Keypad> keypads) {
    if (keypads.empty()) return code;

    string seq { "" };
    for (int i = 0; i < code.length(); i++) {
        char from = i == 0 ? 'A' : code[i-1];
        char to = code[i];
        seq += sequenceToGoFrom(from, to, keypads);
    }
    return seq;
}

string sequenceToGoFrom(char key1, char key2, vector<Keypad> keypads) {
    Keypad keypad = keypads.back();
    keypads.pop_back();
    Vec pos1 { keypad.getKeyPos(key1) };
    Vec pos2 { keypad.getKeyPos(key2) };

    Vec travel { pos2 - pos1 };

    if (travel.x == 0 && travel.y == 0) {
        return "A";
    } else if (travel.x == 0 && travel.y != 0) {
        string sequence = travel.y > 0 ? string(travel.y, 'v') : string(-travel.y, '^');
        sequence += 'A';
        return sequenceFor(sequence, keypads);
    } else if (travel.x != 0 && travel.y == 0) {
        string sequence = travel.x > 0 ? string(travel.x, '>') : string(-travel.x, '<');
        sequence += 'A';
        return sequenceFor(sequence, keypads);
    } else {
        Vec verticalMidPoint { pos1 + Vec{0, travel.y} };
        Vec horizontalMidPoint { pos1 + Vec{travel.x, 0} };
        bool verticalAllowed = keypad.getKeyAt(verticalMidPoint) != ' ';
        bool horizontalAllowed = keypad.getKeyAt(horizontalMidPoint) != ' ';

        string verticalSeq, horizontalSeq;
        if (verticalAllowed) {
            string sequence = travel.y > 0 ? string(travel.y, 'v') : string(-travel.y, '^');
            sequence += travel.x > 0 ? string(travel.x, '>') : string(-travel.x, '<');
            sequence += 'A';
            verticalSeq = sequenceFor(sequence, keypads);
        }
        if (horizontalAllowed) {
            string sequence = travel.x > 0 ? string(travel.x, '>') : string(-travel.x, '<');
            sequence += travel.y > 0 ? string(travel.y, 'v') : string(-travel.y, '^');
            sequence += 'A';
            horizontalSeq = sequenceFor(sequence, keypads);
        }

        if (!verticalAllowed) return horizontalSeq;
        if (!horizontalAllowed) return verticalSeq;
        return verticalSeq.length() < horizontalSeq.length() ? verticalSeq : horizontalSeq;
    }
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

    vector<Keypad> keypads {
        directionalKeypad,
        directionalKeypad,
        numericKeypad
    };

    int complexitySum { 0 };
    string code;
    while (getline(inputFile, code)) {
        string sequence { sequenceFor(code, keypads) };
        cout << code << ": " << sequence << endl;

        int length { (int) sequence.length() };
        int numericPart { stoi(code.substr(0, 3)) };
        int complexity { length * numericPart };
        complexitySum += complexity;

        cout << "This sequence has complexity " << length << " * " << numericPart << " = " << complexity << endl;
        cout << endl;
    }

    cout << "Sum of complexities: " << complexitySum << endl;
}
