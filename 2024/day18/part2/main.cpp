#include <cstddef>
#include <iostream>
#include <fstream>
#include <regex>
#include <stdexcept>
#include <string>
#include <unordered_set>
#include <array>

#define WIDTH 71
#define HEIGHT 71

using namespace std;

struct Vec {
    int x, y;
};

Vec operator+(const Vec &v1, const Vec &v2) {
    return { v1.x + v2.x, v1.y + v2.y };
}

bool operator==(const Vec &v1, const Vec &v2) {
    return v1.x == v2.x && v1.y == v2.y;
}

template<>
struct std::hash<Vec> {
    size_t operator()(const Vec &v) const {
        return v.x * 7 + v.y * 13;
    }
};

const array<Vec, 4> directions {
    Vec{ 1, 0 },
    Vec{ -1, 0 },
    Vec{ 0, 1 },
    Vec{ 0, -1 },
};

bool isPathBlocked(const unordered_set<Vec> &bytePostions) {
    unordered_set<Vec> open;
    unordered_set<Vec> closed;
    open.insert(Vec {0, 0});

    int iteration { 0 };
    Vec goal { WIDTH - 1, HEIGHT - 1 };

    while (open.size() > 0) {
        iteration++;
        unordered_set<Vec> newOpen;

        for (const Vec current : open) {
            closed.insert(current);
            if (current == goal) return false;

            for (const Vec dir : directions) {
                Vec neighbor { current + dir };
                if (neighbor.x < 0 || neighbor.x >= WIDTH) continue;
                if (neighbor.y < 0 || neighbor.y >= HEIGHT) continue;
                if (closed.find(neighbor) != closed.end()) continue;
                if (bytePostions.find(neighbor) != bytePostions.end()) continue;
                if (newOpen.find(neighbor) != newOpen.end()) continue;

                newOpen.insert(neighbor);
            }
        }
        open = newOpen;
    }
    return true;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    regex vectorRegex("(\\d+),(\\d+)");
    vector<Vec> bytes;

    string line;
    while (getline(inputFile, line)) {
        smatch match;
        if (!regex_match(line, match, vectorRegex)) throw runtime_error("Unable to parse line");
        Vec bytePos {
            .x = stoi(match.str(1)),
            .y = stoi(match.str(2))
        };
        bytes.push_back(bytePos);
    }

    // Recherche par dichotomie du byte avec le plus petit indice qui bloque le chemin
    int highestNonBlockingByte { 1023 }; // On sait que le 1024ème byte (d'indice 1023) ne bloque pas le chemin
    int lowestBlockingByte { (int) bytes.size() - 1 }; // Le dernier byte bloque forcément le chemin

    while (highestNonBlockingByte + 1 != lowestBlockingByte) {
        int middleByte = (highestNonBlockingByte + lowestBlockingByte) / 2;
        unordered_set<Vec> byteView = { bytes.begin(), bytes.begin() + middleByte };

        cout << "Processing for first " << byteView.size() << " bytes." << endl;

        if (isPathBlocked(byteView)) {
            lowestBlockingByte = middleByte;
        } else {
            highestNonBlockingByte = middleByte;
        }
    }

    Vec blockingByte { bytes[highestNonBlockingByte] };
    cout << "Byte blocking path: " << blockingByte.x << "," << blockingByte.y << endl;
}
