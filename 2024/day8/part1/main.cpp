#include <iostream>
#include <fstream>
#include <vector>
#include <unordered_map>
#include <unordered_set>

using namespace std;

struct Vec {
    int x;
    int y;

    Vec operator-() const {
        return { -x, -y };
    }

    bool isInBounds(int width, int height) {
        return x >= 0 && x < width && y >= 0 && y < height;
    }
};

Vec operator+(const Vec &v1, const Vec &v2) {
    return Vec{ v1.x + v2.x, v1.y + v2.y };
}

Vec operator-(const Vec &v1, const Vec &v2) {
    return v1 + (-v2);
}

bool operator==(const Vec &v1, const Vec &v2) {
    return v1.x == v2.x && v1.y == v2.y;
}

bool operator!=(const Vec &v1, const Vec &v2) {
    return !(v1 == v2);
}

class VecHashFunction {
public:
    size_t operator()(const Vec &v) const {
        return v.x * 7 + v.y * 13;
    }
};

template<class T, class Callback>
void iterateOnPairs(vector<T> values, Callback callback) {
    for (int i { 0 }; i < values.size() - 1; i++) {
        for (int j { i + 1 }; j < values.size(); j++) {
            callback(values[i], values[j]);
        }
    }
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    unordered_map<char, vector<Vec>> antennas;
    int width { 0 },
        height { 0 };

    string line;
    while (getline(inputFile, line)) {
        if (width == 0) width = line.length();

        for (int x = 0; x < width; x++) {
            char cell { line[x] };
            if (cell != '.') {
                Vec cellPos { x, height };
                if (antennas.find(cell) == antennas.end()) {
                    antennas.insert({cell, vector<Vec>{}});
                }
                antennas.at(cell).push_back(cellPos);
            }
        }
        height++;
    }

    unordered_set<Vec, VecHashFunction> antinodes;

    for (auto it { antennas.begin() }; it != antennas.end(); it++) {
        const vector<Vec> &antennaGroup { it->second };

        iterateOnPairs(antennaGroup, [&antinodes, width, height](const Vec &pos1, const Vec &pos2) mutable -> void {
            Vec translation = pos1 - pos2;

            Vec antinode1 = pos1 + translation;
            Vec antinode2 = pos2 - translation;
            if (antinode1.isInBounds(width, height)) antinodes.insert(antinode1);
            if (antinode2.isInBounds(width, height)) antinodes.insert(antinode2);
        });
    }

    cout << "Number of antinodes: " << antinodes.size() << endl;
}
