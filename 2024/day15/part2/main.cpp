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

        Vec destination { robotPos + dir };
        if (cellAt(destination) == '.' || (cellIsBox(destination) && canMoveBox(destination, dir))) {
            if (cellIsBox(destination))
                moveBox(destination, dir);
            cellAt(robotPos) = '.';
            cellAt(destination) = '@';
            robotPos = destination;
        }
    }

    unsigned long calculateBoxesGPSCoordinates() {
        unsigned long sum { 0 };
        for (int y = 0; y < cells.size(); y++) {
            for (int x = 0; x < cells[y].length(); x++) {
                if (cellAt({x, y}) == '[') {
                    sum += 100 * y + x;
                }
            }
        }
        return sum;
    }

    void print() {
        for (const string &row : cells) {
            cout << row << endl;
        }
    }

private:
    char &cellAt(const Vec &pos) {
        return cells[pos.y][pos.x];
    }

    bool cellIsBox(const Vec &pos) {
        return cellAt(pos) == '[' || cellAt(pos) == ']';
    }

    bool canMoveBox(Vec boxPos, const Vec &dir) {
        if (!cellIsBox(boxPos))
            throw runtime_error("canMoveBox() called where there is no box.");

        // boxPos must point to the left part of the box
        if (cellAt(boxPos) == ']') {
            boxPos.x--;
        }

        cellAt(boxPos) = '.';
        cellAt(boxPos + RIGHT) = '.';

        Vec destLeft { boxPos + dir };
        bool isLeftFree = cellAt(destLeft) == '.' || (cellIsBox(destLeft) && canMoveBox(destLeft, dir));
        Vec destRight { boxPos + dir + RIGHT };
        bool isRightFree = cellAt(destRight) == '.' || (cellIsBox(destRight) && canMoveBox(destRight, dir));

        cellAt(boxPos) = '[';
        cellAt(boxPos + RIGHT) = ']';

        return isLeftFree && isRightFree;
    }

    void moveBox(Vec boxPos, const Vec &dir) {
        if (!cellIsBox(boxPos))
            throw runtime_error("moveBox() called where there is no box.");

        if (!canMoveBox(boxPos, dir)) return;

        // boxPos must point to the left part of the box
        if (cellAt(boxPos) == ']') {
            boxPos.x--;
        }

        cellAt(boxPos) = '.';
        cellAt(boxPos + RIGHT) = '.';

        Vec destLeft { boxPos + dir };
        if (cellIsBox(destLeft)) moveBox(destLeft, dir);
        Vec destRight { boxPos + dir + RIGHT };
        if (cellIsBox(destRight)) moveBox(destRight, dir);

        cellAt(destLeft) = '[';
        cellAt(destRight) = ']';
    }
};

string scaleUpWorldRow(const string &row) {
    string scaledRow { "" };
    for (const char &c : row) {
        if (c == '#') scaledRow.append("##");
        else if (c == 'O') scaledRow.append("[]");
        else if (c == '.') scaledRow.append("..");
        else if (c == '@') scaledRow.append("@.");
    }
    return scaledRow;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    World world;

    string line;
    while (getline(inputFile, line) && line.length() != 0) {
        world.addRow(scaleUpWorldRow(line));
    }

    world.print();
    cout << endl;

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
            /*
            world.print();
            cout << endl;
            */
        }
    }

    cout << "Sum of all boxes' GPS coordinates: " << world.calculateBoxesGPSCoordinates() << endl;
}
