#include <cstddef>
#include <fstream>
#include <string>
#include <unordered_set>
#include <vector>
#include <iostream>
#include <array>

using namespace std;

using Grid = vector<string>;

struct Vec {
    int x;
    int y;

    bool isInBounds(const Vec &size) const {
        return x >= 0 && x < size.x && y >= 0 && y < size.y;
    }

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

bool operator==(const Vec &v1, const Vec &v2) {
    return v1.x == v2.x && v1.y == v2.y;
}

Vec operator+(const Vec &v1, const Vec &v2) {
    return Vec{ v1.x + v2.x, v1.y + v2.y };
}

Vec operator-(const Vec &v1, const Vec &v2) {
    return Vec{ v1.x - v2.x, v1.y - v2.y };
}

template<>
struct std::hash<Vec> {
    size_t operator()(const Vec &v) const {
        return v.x * 7 + v.y * 13;
    }
};

struct Fence {
    Vec inside;
    Vec outside;

    Fence left() const {
        Vec offset { (outside - inside).rotateCounterClockwise() };
        return Fence {
            .inside = inside + offset,
            .outside = outside + offset
        };
    }

    Fence right() const {
        Vec offset { (outside - inside).rotateClockwise() };
        return Fence {
            .inside = inside + offset,
            .outside = outside + offset
        };
    }
};

bool operator==(const Fence &f1, const Fence &f2) {
    return f1.inside == f2.inside && f1.outside == f2.outside;
}

template<>
struct std::hash<Fence> {
    size_t operator()(const Fence &fence) const {
        return fence.inside.x * 5 + fence.inside.y * 7 + fence.outside.x * 11 + fence.outside.y * 13;
    }
};

template<class T>
bool contains(const unordered_set<T> &set, const T &element) {
    return set.find(element) != set.end();
}

char cellAt(const Grid &world, const Vec &pos) {
    Vec size {
        .x = (int) world[0].length(),
        .y = (int) world.size()
    };

    if (!pos.isInBounds(size)) return '\0';
    return world[pos.y][pos.x];
}

void expandFence(const Fence &fence, unordered_set<Fence> &fences, const Grid &world) {
    char insidePlant { world[fence.inside.y][fence.inside.x] };

    Fence curFence { fence };
    while (true) {
        curFence = curFence.left();
        char in { cellAt(world, curFence.inside) };
        char out { cellAt(world, curFence.outside) };
        if (in != insidePlant || out == insidePlant) break;

        fences.insert(curFence);
    }

    curFence = fence;
    while (true) {
        curFence = curFence.right();
        char in { cellAt(world, curFence.inside) };
        char out { cellAt(world, curFence.outside) };
        if (in != insidePlant || out == insidePlant) break;

        fences.insert(curFence);
    }
}

const array<Vec, 4> offsets {
    Vec{ 1, 0 },
    Vec{ -1, 0 },
    Vec{ 0, 1 },
    Vec{ 0, -1 },
};

unordered_set<Vec> closed {};

int calculateRegionPrice(const Vec &position, const Grid &world) {
    Vec size {
        .x = (int) world[0].length(),
        .y = (int) world.size()
    };

    char plantType { cellAt(world, position) };

    unordered_set<Vec> open { position };
    unordered_set<Fence> fences;
    int sideCount { 0 };
    int area { 0 };

    while (!open.empty()) {
        Vec current { open.extract(open.begin()).value() };
        closed.insert(current);
        area++;

        for (const Vec &offset : offsets) {
            Vec neighbor { current + offset };

            if (!neighbor.isInBounds(size) || cellAt(world, neighbor) != plantType) {
                Fence fence { .inside = current, .outside = neighbor };
                if (!contains(fences, fence)) {
                    sideCount++;
                    expandFence(fence, fences, world);
                }
            } else if (!contains(closed, neighbor)) {
                open.insert(neighbor);
            }
        }
    }

    return area * sideCount;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    Grid world;
    string line;
    while (getline(inputFile, line)) {
        world.push_back(line);
    }

    int width { (int) world[0].length() };
    int height { (int) world.size() };
    int totalPrice { 0 };
    Vec pos;
    for (pos.y = 0; pos.y < height; pos.y++) {
        for (pos.x = 0; pos.x < width; pos.x++) {
            if (closed.find(pos) != closed.end()) continue;

            int price { calculateRegionPrice(pos, world) };
            totalPrice += price;
            cout << "Region of type '" << cellAt(world, pos) << "' has price " << price << endl;
        }
    }

    cout << "Total price: " << totalPrice << endl;
}
