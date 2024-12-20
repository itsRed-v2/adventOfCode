#include <cstdlib>
#include <iostream>
#include <fstream>
#include <stdexcept>
#include <string>
#include <map>
#include <vector>
#include <array>
#include <algorithm>

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

const array<Vec, 4> directions {
    Vec{ 1, 0 },
    Vec{ -1, 0 },
    Vec{ 0, 1 },
    Vec{ 0, -1 },
};

int manhattanDistance(const Vec &v1, const Vec &v2) {
    return abs(v1.x - v2.x) + abs(v1.y - v2.y);
}

vector<Vec> getPathWithoutCheats(const Vec &start, const vector<string> &world) {
    vector<Vec> path;
    Vec current = start;

    while (true) {
        path.push_back(current);

        if (world[current.y][current.x] == 'E') {
            return path;
        }

        for (const Vec dir : directions) {
            Vec neighbor { current + dir };
            if (neighbor.x < 0 || neighbor.x >= world[0].length()
                    || neighbor.y < 0 || neighbor.y >= world.size())
                continue;

            char neighborCell { world[neighbor.y][neighbor.x] };
            if (neighborCell != '.' && neighborCell != 'E') continue;

            if (find(path.begin(), path.end(), neighbor) != path.end()) continue;

            current = neighbor;
            break;
        }
    }

    throw runtime_error("Unable to find end");
}

map<int, int> generateCheats(const vector<Vec> &path, const vector<string> &world) {
    map<int, int> cheats;

    for (int i = 0; i < path.size(); i++) {
        Vec pos = path[i];
        int cost = i;

        for (int j = path.size() - 1; j >= 0; j--) {
            Vec posAfterCheat = path[j];
            int distanceCheated = manhattanDistance(pos, posAfterCheat);
            if (distanceCheated > 20) continue;

            int costAfterCheat = j;
            int picosecondsSaved = cost - costAfterCheat - distanceCheated;
            if (picosecondsSaved <= 0) continue;

            if (cheats.find(picosecondsSaved) == cheats.end()) {
                cheats.insert({picosecondsSaved, 1});
            } else {
                cheats.at(picosecondsSaved)++;
            }
        }
    }

    return cheats;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    vector<string> world;
    Vec start;

    string line;
    while (getline(inputFile, line)) {
        world.push_back(line);

        int Spos { (int) line.find('S') };
        if (Spos != line.npos) {
            start.x = Spos;
            start.y = world.size() - 1;
        }
    }

    vector<Vec> path = getPathWithoutCheats(start, world);
    map<int, int> cheats = generateCheats(path, world);

    const int PICOSECOND_TRESHOLD = 100;

    int usefulCheats = 0;
    for (const auto &entry : cheats) {
        int picosecondsSaved = entry.first;
        int cheatCount = entry.second;

        if (picosecondsSaved < PICOSECOND_TRESHOLD) continue;

        usefulCheats += cheatCount;
        cout << "There are " << cheatCount << " cheats that save " << picosecondsSaved << " picoseconds." << endl;
    }

    cout << "In total, " << usefulCheats << " cheats save at least " << PICOSECOND_TRESHOLD << " picoseconds." << endl;
}
