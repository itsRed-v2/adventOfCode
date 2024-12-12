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

    bool isInBounds(const Vec &size) {
        return x >= 0 && x < size.x && y >= 0 && y < size.y;
    }
};

bool operator==(const Vec &v1, const Vec &v2) {
    return v1.x == v2.x && v1.y == v2.y;
}

Vec operator+(const Vec &v1, const Vec &v2) {
    return Vec{ v1.x + v2.x, v1.y + v2.y };
}

template<>
struct std::hash<Vec> {
    size_t operator()(const Vec &v) const {
        return v.x * 7 + v.y * 13;
    }
};

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

    char plantType { world[position.y][position.x] };

    unordered_set<Vec> open { position };
    int fenceCount { 0 };
    int area { 0 };

    while (!open.empty()) {
        Vec current { open.extract(open.begin()).value() };
        closed.insert(current);
        area++;

        for (const Vec &offset : offsets) {
            Vec neighbor { current + offset };

            if (!neighbor.isInBounds(size) || world[neighbor.y][neighbor.x] != plantType) {
                fenceCount++;
            } else if (closed.find(neighbor) == closed.end()) {
                open.insert(neighbor);
            }
        }
    }

    return area * fenceCount;
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
            cout << "Region of type '" << world[pos.y][pos.x] << "' has price " << price << endl;
        }
    }

    cout << "Total price: " << totalPrice << endl;
}
