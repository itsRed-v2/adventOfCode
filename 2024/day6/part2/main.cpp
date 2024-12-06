#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <unordered_set>

using namespace std;

struct Vec {
    int x;
    int y;

    void rotate90Degrees() {
        int tmp { x };
        x = -y;
        y = tmp;
    }
};

Vec operator+(const Vec &v1, const Vec &v2) {
    return Vec{ v1.x + v2.x, v1.y + v2.y };
}

bool operator==(const Vec &v1, const Vec &v2) {
    return v1.x == v2.x && v1.y == v2.y;
}

class VecHashFunction {
public:
    size_t operator()(const Vec &v) const {
        return v.x * 7 + v.y * 13;
    }
};

class VecPairHashFunction {
public:
    size_t operator()(const pair<Vec, Vec> &p) const {
        return p.first.x * 7 + p.first.y * 11 + p.second.x * 13 + p.second.y * 17;
    }
};

bool isOutOfBounds(Vec pos, Vec size) {
    return pos.x < 0 || pos.x >= size.x || pos.y < 0 || pos.y >= size.y;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    Vec guardStart { -1, -1 };
    vector<string> world;

    string line;
    while (getline(inputFile, line)) {
        world.push_back(line);
        string::const_iterator guardPos { find(line.begin(), line.end(), '^') };
        if (guardPos != line.end()) {
            guardStart.y = world.size() - 1;
            guardStart.x = guardPos - line.begin();
        }
    }

    if (guardStart.x == -1) {
        cout << "Error: could not find guard" << endl;
        return 1;
    }

    int width { (int) world[0].length() };
    int height { (int) world.size() };
    Vec size { width, height };

    Vec guard { guardStart };
    Vec dir { 0, -1 };

    unordered_set<Vec, VecHashFunction> visitedPositions;
    visitedPositions.insert(guard);

    while (true) {
        Vec front = guard + dir;
        if (isOutOfBounds(front, size)) break;

        if (world[front.y][front.x] == '#') {
            dir.rotate90Degrees();
        } else {
            guard = front;
            visitedPositions.insert(guard);
        }
    }

    int totalIterations { (int) visitedPositions.size() };
    int currentIteration { 0 };
    int obstaclesFound { 0 };
    for (const Vec &potentialObstacle : visitedPositions) {
        currentIteration++;
        cout << "Iteration " << currentIteration << " / " << totalIterations
            << ". Obstacles found: " << obstaclesFound << endl;

        Vec dir { 0, -1 };
        Vec guard { guardStart };

        unordered_set<pair<Vec, Vec>, VecPairHashFunction> positions;
        positions.insert(pair{guard, dir});

        while (true) {
            Vec front = guard + dir;
            if (isOutOfBounds(front, size)) break;

            if (world[front.y][front.x] == '#' || front == potentialObstacle) {
                dir.rotate90Degrees();
            } else {
                guard = front;
                if (positions.find(pair{guard, dir}) != positions.end()) {
                    obstaclesFound++;
                    break;
                }
                positions.insert(pair{guard, dir});
            }
        }
    }

    cout << "Valid obstacles found: " << obstaclesFound << endl;

    return 0;
}
