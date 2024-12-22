#include <cstdint>
#include <iostream>
#include <fstream>
#include <cassert>

using namespace std;

uint64_t mix(uint64_t n1, uint64_t n2) {
    return n1 ^ n2;
}

uint64_t prune(uint64_t number) {
    return number % 16777216;
}

uint64_t computeNextSecret(uint64_t secret) {
    secret = prune(mix(secret, secret * 64));
    secret = prune(mix(secret, secret / 32));
    secret = prune(mix(secret, secret * 2048));
    return secret;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    assert(mix(42, 15) == 37);
    assert(prune(100000000) == 16113920);

    uint64_t secretSum = 0;
    string line;
    while (getline(inputFile, line)) {
        uint64_t initialSecret { stoull(line) };
        uint64_t secret = initialSecret;
        for (int i = 0; i < 2000; i++) {
            secret = computeNextSecret(secret);
        }
        secretSum += secret;
        cout << initialSecret << ": " << secret << endl;
    }
    cout << "Sum of secrets: " << secretSum << endl;
}
