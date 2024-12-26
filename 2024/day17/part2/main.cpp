#include <cmath>
#include <cstdint>
#include <iostream>
#include <vector>

using namespace std;

uint8_t transform(uint64_t A) {
    return ((A % 8) ^ 1 ^ (A / (uint64_t) pow(2, (A % 8) ^ 2))) % 8;
}

vector<uint8_t> run(uint64_t A) {
    vector<uint8_t> output;

    uint64_t B = 0, C = 0;
    do {
        /*
        B = A % 8;
        B = B ^ 2;
        C = A / pow(2, B);
        B = B ^ C;
        B = B ^ 3;
        output.push_back(B % 8);
        */
        output.push_back(transform(A));
        A /= 8;
    } while (A != 0);

    return output;
}

int64_t recursiveSearch(uint64_t A, int iteration, const vector<uint8_t> &wantedSequence) {
    if (iteration < 0) return A;

    uint64_t Amin = A * 8;
    uint64_t Amax = A * 8 + 7;

    for (uint64_t prevA = Amin; prevA <= Amax; prevA++) {
        if (transform(prevA) == wantedSequence[iteration]) {
            int64_t result = recursiveSearch(prevA, iteration - 1, wantedSequence);
            if (result != -1) return result;
        }
    }

    return -1;
}

int main() {
    vector<uint8_t> wantedSequence { 2, 4, 1, 2, 7, 5, 4, 7, 1, 3, 5, 5, 0, 3, 3, 0 };

    int iteration = wantedSequence.size() - 1;
    uint64_t A = 0;
    uint64_t initialA = recursiveSearch(A, iteration, wantedSequence);
    cout << "Initial A: " << initialA << endl;

    cout << "With this value of A, the program outputs:" << endl;
    vector<uint8_t> output { run(initialA) };
    for (int i = 0; i < output.size(); i++) {
        if (i != 0) cout << ",";
        cout << (int) output[i];
    }
    cout << endl;
}
