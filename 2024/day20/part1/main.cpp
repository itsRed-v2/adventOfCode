#include <cstdlib>
#include <iostream>
#include <fstream>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <array>

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
        return v.x * 5 + v.y * 7;
    }
};

const array<Vec, 4> directions {
    Vec{ 1, 0 },
    Vec{ -1, 0 },
    Vec{ 0, 1 },
    Vec{ 0, -1 },
};

struct Node {
    Vec pos;
    int picoseconds;

    vector<Node> getNeighbors(const vector<string> &world) {
        vector<Node> neighbors;

        for (const Vec dir : directions) {
            Vec neighborPos { pos + dir };
            if (neighborPos.x < 0 || neighborPos.x >= world[0].length()
                    || neighborPos.y < 0 || neighborPos.y >= world.size()) {
                continue;
            }

            char neighborCell { world[neighborPos.y][neighborPos.x] };
            if (neighborCell == '.' || neighborCell == 'E') {
                neighbors.push_back({
                        neighborPos,
                        picoseconds + 1
                        });
            }
        }

        return neighbors;
    }
};

bool operator==(const Node &n1, const Node &n2) {
    return n1.pos.x == n2.pos.x && n1.pos.y == n2.pos.y;
}

template<>
struct std::hash<Node> {
    size_t operator()(const Node &node) const {
        return node.pos.x * 5 + node.pos.y * 7;
    }
};

unordered_set<Node> getPathWithoutCheats(const Vec &start, const vector<string> &world) {
    unordered_set<Node> closed;
    Node current {
            .pos = start,
            .picoseconds = 0
    };

    while (true) {
        closed.insert(current);

        if (world[current.pos.y][current.pos.x] == 'E') {
            return closed;
        }

        for (const Node &neighbor : current.getNeighbors(world)) {
            if (closed.find(neighbor) != closed.end()) continue;

            current = neighbor;
        }
    }

    throw runtime_error("Unable to find end");
}

int countCheats(const unordered_map<Vec, int> &positionCostMap, const vector<string> &world) {
    int usefulCheatCount { 0 };

    for (const auto &node : positionCostMap) {
        Vec pos { node.first };
        int cost { node.second };

        for (const Vec dir : directions) {
            Vec posAfterCheat { pos + dir + dir };
            if (posAfterCheat.x < 0 || posAfterCheat.x >= world[0].length()
                    || posAfterCheat.y < 0 || posAfterCheat.y >= world.size())
                continue;

            char cell { world[posAfterCheat.y][posAfterCheat.x] };
            if (cell == '#') continue;

            int costAfterCheat { positionCostMap.at(posAfterCheat) };
            int picosecondsSaved = cost - costAfterCheat - 2; // on soustrait 2 car tricher prends 2 mouvements
            if (picosecondsSaved >= 100) {
                usefulCheatCount++;
            }
        }
    }

    return usefulCheatCount;
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

    unordered_set<Node> path = getPathWithoutCheats(start, world);

    unordered_map<Vec, int> positionCostMap;
    for (const Node &node : path) {
        positionCostMap.insert({ node.pos, node.picoseconds });
    }

    int usefulCheats = countCheats(positionCostMap, world);
    cout << "Number of cheats saving at least 100 picoseconds: " << usefulCheats << endl;
}
