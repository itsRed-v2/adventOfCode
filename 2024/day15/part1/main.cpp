#include <algorithm>
#include <iostream>
#include <fstream>
#include <stdexcept>
#include <string>
#include <vector>

using namespace std;

struct Vec {
    int x;
    int y;

    Vec &operator+=(const Vec &rhs) {
        x += rhs.x;
        y += rhs.y;
        return *this;
    }
};

Vec operator+(const Vec &v1, const Vec &v2) {
    return Vec{ v1.x + v2.x, v1.y + v2.y };
}

const Vec UP { 0, -1 };
const Vec DOWN { 0, 1 };
const Vec LEFT { -1, 0 };
const Vec RIGHT { 1, 0 };

class World {
    vector<string> cells;
    Vec robotPos;

public:
    void addRow(string line) {
        cells.push_back(line);

        string::iterator robotIt { find(line.begin(), line.end(), '@') };
        if (robotIt != line.end()) {
            robotPos = {
                .x = (int) std::distance(line.begin(), robotIt),
                .y = (int) cells.size() - 1
            };
        }
    }

    void moveRobot(const Vec &dir) {
        if (cellAt(robotPos) != '@')
            throw runtime_error("Lost trace of the robot.");

        if (moveObject(robotPos, dir)) {
            robotPos += dir;
        }
    }

    unsigned long calculateBoxesGPSCoordinates() {
        unsigned long sum { 0 };
        for (int y = 0; y < cells.size(); y++) {
            for (int x = 0; x < cells[y].length(); x++) {
                if (cellAt({x, y}) == 'O') {
                    sum += 100 * y + x;
                }
            }
        }
        return sum;
    }

private:
    char &cellAt(const Vec &pos) {
        return cells[pos.y][pos.x];
    }

    /*
     * returns true if the object was moved successfully, false if nothing happened
     */
    bool moveObject(const Vec &objectPos, const Vec &dir) {
        char object = cellAt(objectPos);
        if (object != 'O' && object != '@')
            throw runtime_error("moveObject() called where there is no box and no robot.");

        Vec destination { objectPos + dir };
        if (cellAt(destination) == '.' || (cellAt(destination) == 'O' && moveObject(destination, dir))) {
            cellAt(objectPos) = '.';
            cellAt(destination) = object;
            return true;
        }
        return false; // if cell is neither 'O' or '.' it must be '#'
    }
};

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    World world;

    string line;
    while (getline(inputFile, line) && line.length() != 0) {
        world.addRow(line);
    }

    while (getline(inputFile, line)) {
        for (const char &instruction : line) {
            Vec dir;
            switch (instruction) {
                case '^':
                    dir = UP;
                    break;
                case 'v':
                    dir = DOWN;
                    break;
                case '<':
                    dir = LEFT;
                    break;
                case '>':
                    dir = RIGHT;
                    break;
                default:
                    throw runtime_error("Unknown instructon character: " + to_string(instruction));
            }
            world.moveRobot(dir);
        }
    }

    cout << "Sum of all boxes' GPS coordinates: " << world.calculateBoxesGPSCoordinates() << endl;
}
