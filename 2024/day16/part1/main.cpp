#include <algorithm>
#include <array>
#include <iostream>
#include <fstream>
#include <stdexcept>
#include <vector>
#include <algorithm>
#include <unordered_set>

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

struct Node {
    Vec pos;
    Vec dir;
    int cost;

    array<Node, 3> getNeighbors() const {
        return {
            Node{
                .pos = pos + dir,
                .dir = dir,
                .cost = cost + 1
            },
            Node{
                .pos = pos,
                .dir = dir.rotateClockwise(),
                .cost = cost + 1000
            },
            Node{
                .pos = pos,
                .dir = dir.rotateCounterClockwise(),
                .cost = cost + 1000
            }
        };
    }
};

bool operator<(const Node &lhs, const Node &rhs) {
    return lhs.cost < rhs.cost;
}

struct NodeHash {
    size_t operator()(const Node &node) const {
        return node.pos.x * 3 + node.pos.y * 5 + node.dir.x * 7 + node.dir.y * 11;
    }
};

struct NodeEqual {
    bool operator()(const Node &lhs, const Node &rhs) const {
        return lhs.pos == rhs.pos && lhs.dir == rhs.dir;
    }
};

bool isPassable(const Vec &pos, const vector<string> &world) {
    return pos.x >= 0 && pos.y >= 0
        && pos.y < world.size() && pos.x < world[0].length()
        && world[pos.y][pos.x] != '#';
}

int getLowestScore(const Vec &start, const Vec &exit, const vector<string> &world) {
    vector<Node> open;
    unordered_set<Node, NodeHash, NodeEqual> closed;
    open.emplace_back(Node{
            .pos = start,
            .dir = Vec{ 1, 0 },
            .cost = 0
    });

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

        if (current.pos == exit) return current.cost;

        for (const Node &neighbor : current.getNeighbors()) {
            if (isPassable(neighbor.pos, world) && closed.find(neighbor) == closed.end()) {
                open.push_back(neighbor);
            }
        }
    }
    throw runtime_error("Unable to solve maze.");
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

    int lowestScorePossible = getLowestScore(start, exit, world);
    cout << "Lowest score possible: " << lowestScorePossible << endl;
}
