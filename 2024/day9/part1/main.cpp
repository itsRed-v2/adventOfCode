#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    string input;
    getline(inputFile, input);

    vector<int> disk;
    int currentFileId { 0 };
    for (int i = 0; i < input.length(); i++) {
        int blockSize { input[i] - '0' };
        if (i % 2 == 0) { // file block
            for (int j = 0; j < blockSize; j++) {
                disk.push_back(currentFileId);
            }
            currentFileId++;
        } else { // empty block
            for (int j = 0; j < blockSize; j++) {
                disk.push_back(-1);
            }
        }
    }

    cout << "Initial disk length: " << disk.size() << endl;

    vector<int>::iterator filler { find(disk.begin(), disk.end(), -1) };
    while (filler != disk.end()) {
        while (disk.back() == -1) disk.pop_back();

        int blockId { disk.back() };
        disk.pop_back();
        *filler = blockId;

        while (*filler != -1 && filler != disk.end()) filler++;
    }

    cout << "Compressed disk length: " << disk.size() << endl;

    long checksum { 0 };
    for (int i = 0; i < disk.size(); i++) {
        checksum += i * disk[i];
    }

    cout << "Filesystem checksum: " << checksum << endl;
}
