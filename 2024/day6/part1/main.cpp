#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <set>

using namespace std;

void visualize(const vector<string> &world, const set<pair<int, int>> &visitedPositions) {
    int width { (int) world[0].length() };
    int height { (int) world.size() };

    for (int y = 0; y < height; y++) {
        string row { world[y] };
        for (int x = 0; x < width; x++) {
            if (visitedPositions.contains(pair{x, y})) {
                row[x] = 'X';
            }
        }
        cout << row << endl;
    }
}

bool isOutOfBounds(int index, int arraySize) {
    return index < 0 || index >= arraySize;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    int guardX { -1 }, guardY { -1 };
    vector<string> world;

    string line;
    while (getline(inputFile, line)) {
        world.push_back(line);
        string::const_iterator guardPos { find(line.begin(), line.end(), '^') };
        if (guardPos != line.end()) {
            guardY = world.size() - 1;
            guardX = guardPos - line.begin();
        }
    }

    if (guardX == -1 || guardY == -1) {
        cout << "Error: could not find guard" << endl;
        return 1;
    }

    int width { (int) world[0].length() };
    int height { (int) world.size() };

    set<pair<int, int>> visitedPositions;
    visitedPositions.emplace(guardX, guardY);

    int dirX { 0 }, dirY { -1 };

    while (true) {
        int frontX { guardX + dirX };
        int frontY { guardY + dirY };

        if (isOutOfBounds(frontX, width) || isOutOfBounds(frontY, height))
            break;

        if (world[frontY][frontX] == '#') {
            // rotate direction 90 deg
            int tmp { dirX };
            dirX = -dirY;
            dirY = tmp;
        } else {
            guardX = frontX;
            guardY = frontY;
            visitedPositions.emplace(guardX, guardY);
        }

        /*
        visualize(world, visitedPositions);
        cout << endl;
        */
    }

    cout << "Visited positions count: " << visitedPositions.size() << endl;

    return 0;
}
