#include <algorithm>
#include <array>
#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
#include <unordered_set>
#include <unordered_map>

using namespace std;

struct Vec {
    int x;
    int y;

    Vec rotateClockwise() const {
        return Vec {
            .x = -y,
            .y = x
        };
    }

    Vec rotateCounterClockwise() const {
        return Vec {
            .x = y,
            .y = -x
        };
    }
};

Vec operator+(const Vec &lhs, const Vec &rhs) {
    return { lhs.x + rhs.x, lhs.y + rhs.y };
}

bool operator==(const Vec &lhs, const Vec &rhs) {
    return lhs.x == rhs.x && lhs.y == rhs.y;
}

template<>
class std::hash<Vec> {
public:
    size_t operator()(const Vec &vec) const {
        return vec.x * 7 + vec.y * 13;
    }
};

struct Node {
    Vec pos;
    Vec dir;
    int cost;

    array<Node, 3> getNeighbors() const {
        return {
            Node{
                .pos = pos + dir,
                .dir = dir,
                .cost = cost + 1,
            },
            Node{
                .pos = pos,
                .dir = dir.rotateClockwise(),
                .cost = cost + 1000,
            },
            Node{
                .pos = pos,
                .dir = dir.rotateCounterClockwise(),
                .cost = cost + 1000,
            }
        };
    }
};

bool operator<(const Node &lhs, const Node &rhs) {
    return lhs.cost < rhs.cost;
}

bool operator==(const Node &lhs, const Node &rhs) {
    return lhs.pos == rhs.pos && lhs.dir == rhs.dir;
}

template<>
struct std::hash<Node> {
    size_t operator()(const Node &node) const {
        return node.pos.x * 3 + node.pos.y * 5 + node.dir.x * 7 + node.dir.y * 11;
    }
};

bool isPassable(const Vec &pos, const vector<string> &world) {
    return pos.x >= 0 && pos.y >= 0
        && pos.y < world.size() && pos.x < world[0].length()
        && world[pos.y][pos.x] != '#';
}

void addPathToSet(const Node &node, const unordered_multimap<Node, Node> &parentMap, unordered_set<Vec> &tiles) {
    tiles.insert(node.pos);

    auto range { parentMap.equal_range(node) };
    for (auto it = range.first; it != range.second; it++) {
        const Node &parent { it->second };
        addPathToSet(parent, parentMap, tiles);
    }
}

int countTilesOnBestPath(const Vec &start, const Vec &exit, const vector<string> &world) {
    unordered_multimap<Node, Node> parentMap;

    vector<Node> open;
    unordered_set<Node> closed;
    open.emplace_back(Node{
            .pos = start,
            .dir = Vec{ 1, 0 },
            .cost = 0
    });

    unordered_set<Vec> tilesOnBestPath;

    while (open.size() != 0) {
        vector<Node>::iterator it { min_element(open.begin(), open.end()) };
        Node current { *it };
        open.erase(it);
        closed.insert(current);

        /*
        cout << "Current:" << endl;
        cout << "pos: " << current.pos.x << ", " << current.pos.y << endl;
        cout << "dir: " << current.dir.x << ", " << current.dir.y << endl;
        cout << "cost: " << current.cost << endl;
        */

        if (current.pos == exit) {
            addPathToSet(current, parentMap, tilesOnBestPath);
            cout << "Found result: " << current.cost
                << " (current orientation: " << current.dir.x << ", " << current.dir.y << ")"
                << endl;
            continue;
        }

        for (const Node &neighbor : current.getNeighbors()) {
            if (!isPassable(neighbor.pos, world)) continue;
            if (closed.find(neighbor) != closed.end()) continue;

            auto openDuplicatePtr { find(open.begin(), open.end(), neighbor) };
            if (openDuplicatePtr == open.end()) { // neighbor has no duplicate in open set
                open.push_back(neighbor);
                parentMap.insert({neighbor, current});
            } else { // neighbor has an open duplicate
                Node &duplicate { *openDuplicatePtr };
                if (duplicate.cost > neighbor.cost) {
                    duplicate = neighbor;
                    parentMap.erase(duplicate);
                    parentMap.insert({duplicate, current});
                } else if (duplicate.cost == neighbor.cost) {
                    parentMap.insert({duplicate, current});
                }
            }
        }
    }

    return tilesOnBestPath.size();
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    vector<string> world;
    Vec start, exit;

    string line;
    while (getline(inputFile, line)) {
        world.push_back(line);

        int startIndex = line.find('S');
        if (startIndex != line.npos) {
            start.x = startIndex;
            start.y = world.size() - 1;
        }

        int exitIndex = line.find('E');
        if (exitIndex != line.npos) {
            exit.x = exitIndex;
            exit.y = world.size() - 1;
        }
    }

    cout << "start " << start.x << ", " << start.y << endl;
    cout << "exit " << exit.x << ", " << exit.y << endl;

    int tileCount = countTilesOnBestPath(start, exit, world);
    cout << "Tiles part of one of the best paths: " << tileCount << endl;
}
