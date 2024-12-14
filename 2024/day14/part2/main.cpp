#include <iostream>
#include <fstream>
#include <regex>
#include <sstream>

#define WIDTH 101
#define HEIGHT 103

using namespace std;

struct Robot {
    int startX;
    int startY;
    int Vx;
    int Vy;
};

struct Vec {
    int x;
    int y;
};

struct Rectangle {
    int minX;
    int maxX;
    int minY;
    int maxY;

    bool isPosInside(const Vec &pos) const {
        return pos.x <= maxX && pos.x >= minX && pos.y <= maxY && pos.y >= minY;
    }

    unsigned long area() const {
        return (maxX - minX + 1) * (maxY - minY + 1);
    }
};

Vec getRobotPositionAfter(const Robot &robot, int seconds) {
    int finalX { (robot.startX + robot.Vx * seconds) % WIDTH };
    if (finalX < 0) finalX += WIDTH;

    int finalY { (robot.startY + robot.Vy * seconds) % HEIGHT };
    if (finalY < 0) finalY += HEIGHT;

    return Vec{finalX, finalY};
}

float getDensityInRect(const Rectangle &rect, int time, const vector<Robot> &robots) {
    int robotCount { 0 };
    for (const Robot &bot : robots) {
        Vec botPos { getRobotPositionAfter(bot, time) };
        if (rect.isPosInside(botPos)) robotCount++;
    }
    return robotCount / (float) rect.area();
}

void drawWorldAt(int time, const vector<Robot> &robots) {
    vector<string> canvas;
    for (int y = 0; y < HEIGHT; y++) {
        canvas.push_back(string(WIDTH, ' '));
    }

    for (const Robot &bot : robots) {
        Vec botPos { getRobotPositionAfter(bot, time) };
        canvas[botPos.y][botPos.x] = '#';
    }

    for (const string &line : canvas) {
        cout << line << endl;
    }
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

    vector<Robot> robots;

    for (sregex_iterator it = matchBegin; it != matchEnd; it++) {
        smatch match { *it };
        robots.push_back({
            .startX = stoi(match.str(1)),
            .startY = stoi(match.str(2)),
            .Vx = stoi(match.str(3)),
            .Vy = stoi(match.str(4)),
        });
    }

    Rectangle centerZone {
        .minX = 25,
        .maxX = 75,
        .minY = 25,
        .maxY = 75,
    };

    for (int s = 0; s < 10000; s++) {
        float density = getDensityInRect(centerZone, s, robots);
        if (density > 0.1) {
            drawWorldAt(s, robots);
            cout << "Center rectangle density: " << density << ", time elapsed: " << s << " seconds." << endl;
        }
    }
}
