#include <cstddef>
#include <fstream>
#include <iostream>
#include <unordered_set>
#include <vector>

using namespace std;
using Grid = vector<vector<char>>;

struct Vec {
    int x;
    int y;
};

Vec operator+(const Vec &v1, const Vec &v2) {
    return Vec{ v1.x + v2.x, v1.y + v2.y };
}

bool operator==(const Vec &v1, const Vec &v2) {
    return v1.x == v2.x && v1.y == v2.y;
}

struct VecHashFunction {
    size_t operator()(const Vec &v) const {
        return v.x * 7 + v.y * 13;
    }
};

const vector<Vec> offsets {
    Vec{1, 0},
    Vec{-1, 0},
    Vec{0, 1},
    Vec{0, -1},
};

int calculateTrailheadScore(Vec trailhead, const Grid &world) {
    int height { (int) world.size() };
    int width { (int) world[0].size() };

    unordered_set<Vec, VecHashFunction> closed;
    closed.insert(trailhead);

    for (int currentHeight { 0 }; currentHeight < 9; currentHeight++) {
        unordered_set<Vec, VecHashFunction> open;

        for (const Vec &pos : closed) {
            for (const Vec &offset : offsets) {
                Vec neighbor { pos + offset };
                if (neighbor.x >= 0 && neighbor.x < width && neighbor.y >= 0 && neighbor.y < height && world[neighbor.y][neighbor.x] == currentHeight + 1) {
                    open.insert(neighbor);
                }
            }
        }

        closed = open;
    }

    return closed.size();
}

int main() {
    ifstream inputFile ("input.txt");

    Grid world;
    string line;
    while (getline(inputFile, line)) {
        world.emplace_back();
        for (const char &character : line) {
            world.back().push_back(character - '0');
        }
    }

    int height { (int) world.size() };
    int width { (int) world[0].size() };

    int totalScore { 0 };
    Vec pos;
    for (pos.y = 0; pos.y < height; pos.y++) {
        for (pos.x = 0; pos.x < width; pos.x++) {
            if (world[pos.y][pos.x] != 0) continue;
            totalScore += calculateTrailheadScore(pos, world);
        }
    }

    cout << "Total score: " << totalScore << endl;
    return 0;
}
