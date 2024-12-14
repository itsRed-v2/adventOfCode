#include <iostream>
#include <fstream>
#include <regex>
#include <sstream>
#include <array>

#define WIDTH 101
#define HEIGHT 103

using namespace std;

struct Robot {
    int startX;
    int startY;
    int Vx;
    int Vy;
};

/*
 * Returns an integer representing the quadrant:
 * 0: No quadrant
 * 1: top right quadrant
 * 2: top left quadrant
 * 3: bottom right quadrant
 * 4: bottom left quadrant
 */
int getQuadrantAfter100sec(const Robot &robot) {
    int finalX { (robot.startX + robot.Vx * 100) % WIDTH };
    if (finalX < 0) finalX += WIDTH;

    int finalY { (robot.startY + robot.Vy * 100) % HEIGHT };
    if (finalY < 0) finalY += HEIGHT;

    int centerX = WIDTH / 2;
    int centerY = HEIGHT / 2;
    if (finalX < centerX) {
        if (finalY < centerY) return 1;
        if (finalY > centerY) return 3;
    }
    if (finalX > centerX) {
        if (finalY < centerY) return 2;
        if (finalY > centerY) return 4;
    }
    return 0;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    stringstream buffer;
    buffer << inputFile.rdbuf();
    string input { buffer.str() };

    regex robotRegex("p=(-?\\d+),(-?\\d+) v=(-?\\d+),(-?\\d+)");

    sregex_iterator matchBegin { sregex_iterator(input.begin(), input.end(), robotRegex) };
    sregex_iterator matchEnd { sregex_iterator() };

    cout << "Found " << std::distance(matchBegin, matchEnd) << " robots." << endl;

    array<int, 4> quadrantRobotsCount { 0, 0, 0, 0 };

    for (sregex_iterator it = matchBegin; it != matchEnd; it++) {
        smatch match { *it };
        Robot robot {
            .startX = stoi(match.str(1)),
            .startY = stoi(match.str(2)),
            .Vx = stoi(match.str(3)),
            .Vy = stoi(match.str(4)),
        };

        int quadrant { getQuadrantAfter100sec(robot) };
        if (quadrant != 0) {
            ++quadrantRobotsCount[quadrant - 1];
        }
    }

    int safetyFactor { 1 };
    for (int robotCount : quadrantRobotsCount) {
        safetyFactor *= robotCount;
    }

    cout << "Safety factor: " << safetyFactor << endl;
}
