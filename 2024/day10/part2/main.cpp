#include <fstream>
#include <iostream>
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

const vector<Vec> offsets {
    Vec{1, 0},
    Vec{-1, 0},
    Vec{0, 1},
    Vec{0, -1},
};

int calculateTrailRank(Vec position, const Grid &world) {
    int currentHeight{ world[position.y][position.x] };
    if (currentHeight == 9) return 1;

    int height { (int) world.size() };
    int width { (int) world[0].size() };

    int rank { 0 };
    for (const Vec &offset : offsets) {
        Vec neighbor { position + offset };
        if (neighbor.x >= 0
                && neighbor.x < width
                && neighbor.y >= 0
                && neighbor.y < height
                && world[neighbor.y][neighbor.x] == currentHeight + 1) {
            rank += calculateTrailRank(neighbor, world);
        }
    }
    return rank;
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

    int totalRank { 0 };
    Vec pos;
    for (pos.y = 0; pos.y < height; pos.y++) {
        for (pos.x = 0; pos.x < width; pos.x++) {
            if (world[pos.y][pos.x] != 0) continue;
            totalRank += calculateTrailRank(pos, world);
        }
    }

    cout << "Total rank: " << totalRank << endl;
    return 0;
}
