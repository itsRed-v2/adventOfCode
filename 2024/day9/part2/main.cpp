#include <iostream>
#include <fstream>
#include <string>
#include <vector>

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

    int currentBlockIndex { (int) disk.size() - 1 };
    while (currentBlockIndex >= 0) {
        if (disk[currentBlockIndex] == -1) {
            currentBlockIndex--;
            continue;
        }

        int blockId { disk[currentBlockIndex] };
        int fileLength { 0 };
        for (; currentBlockIndex >= 0; currentBlockIndex--) {
            if (disk[currentBlockIndex] == blockId) fileLength++;
            else break;
        }

        int contiguousSpace { 0 };
        for (int i = 0; i <= currentBlockIndex; i++) {
            if (disk[i] == -1) contiguousSpace++;
            else contiguousSpace = 0;

            if (contiguousSpace >= fileLength) {
                for (int j = i; j > i - fileLength; j--) {
                    disk[j] = blockId;
                }
                for (int j = currentBlockIndex + 1; j < currentBlockIndex + fileLength + 1; j++) {
                    disk[j] = -1;
                }
                break;
            }
        }
    }

    long checksum { 0 };
    for (int i = 0; i < disk.size(); i++) {
        if (disk[i] != -1) checksum += i * disk[i];
    }

    cout << "Filesystem checksum: " << checksum << endl;
}
