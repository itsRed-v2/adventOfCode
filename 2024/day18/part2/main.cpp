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

int getStepsToExit(const unordered_set<Vec> &bytePostions) {
    vector<Vec> open;
    unordered_set<Vec> closed;
    open.push_back(Vec {0, 0});

    int iteration { 0 };
    Vec goal { WIDTH - 1, HEIGHT - 1 };

    while (open.size() > 0) {
        iteration++;
        vector<Vec> newOpen;

        for (const Vec current : open) {
            closed.insert(current);
            if (current == goal) return iteration - 1;

            for (const Vec dir : directions) {
                Vec neighbor { current + dir };
                if (neighbor.x < 0 || neighbor.x >= WIDTH) continue;
                if (neighbor.y < 0 || neighbor.y >= HEIGHT) continue;
                if (closed.find(neighbor) != closed.end()) continue;
                if (bytePostions.find(neighbor) != bytePostions.end()) continue;
                if (find(newOpen.begin(), newOpen.end(), neighbor) != newOpen.end()) continue;

                newOpen.push_back(neighbor);
            }
        }
        open = newOpen;
    }
    return -1;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    regex vectorRegex("(\\d+),(\\d+)");
    unordered_set<Vec> firstBytes;

    string line;
    while (getline(inputFile, line) && firstBytes.size() < 1024) {
        smatch match;
        if (!regex_match(line, match, vectorRegex)) throw runtime_error("Unable to parse line");
        Vec bytePos {
            .x = stoi(match.str(1)),
            .y = stoi(match.str(2))
        };
        firstBytes.insert(bytePos);
    }

    while (getline(inputFile, line)) {
        cout << "Processing for first " << firstBytes.size() << " bytes." << endl;
        smatch match;
        if (!regex_match(line, match, vectorRegex)) throw runtime_error("Unable to parse line");
        Vec bytePos {
            .x = stoi(match.str(1)),
            .y = stoi(match.str(2))
        };
        firstBytes.insert(bytePos);

        int minimumStepCount { getStepsToExit(firstBytes) };
        if (minimumStepCount == -1) {
            cout << "Byte blocking path: " << bytePos.x << "," << bytePos.y << endl;
            return 0;
        }
    }

}
