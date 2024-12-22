#include <cstddef>
#include <cstdint>
#include <iostream>
#include <fstream>
#include <cassert>
#include <vector>
#include <array>
#include <unordered_map>

using namespace std;
using Sequence = array<char, 4>;

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

array<char, 2001> getPricesForBuyer(uint64_t initialSecret) {
    array<char, 2001> prices;

    prices[0] = initialSecret % 10;

    uint64_t secret = initialSecret;
    for (int i = 0; i < 2000; i++) {
        secret = computeNextSecret(secret);
        prices[i+1] = secret % 10;
    }

    return prices;
}

struct SequenceHash {
    size_t operator()(const Sequence &seq) const {
        return seq[0] * 3 + seq[1] * 5 + seq[2] * 7 * seq[3] * 11;
    }
};

unordered_map<Sequence, int, SequenceHash> getSequenceProfits(array<char, 2001> prices) {
    unordered_map<Sequence, int, SequenceHash> sequenceProfits;

    for (int i = 4; i < 2001; i++) {
        Sequence sequence;
        for (int j = 0; j < 4; j++) {
            sequence[j] = prices[i - 3 + j] - prices[i - 4 + j];
        }

        int bananas = prices[i];

        if (sequenceProfits.find(sequence) == sequenceProfits.end()) {
            sequenceProfits.insert({sequence, bananas});
        }
    }
    return sequenceProfits;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    assert(mix(42, 15) == 37);
    assert(prune(100000000) == 16113920);

    vector<array<char, 2001>> buyers;

    string line;
    while (getline(inputFile, line)) {
        uint64_t initialSecret { stoull(line) };
        buyers.push_back(getPricesForBuyer(initialSecret));
    }

    cout << "Buyers: " << buyers.size() << endl;

    unordered_map<Sequence, int, SequenceHash> sequenceProfitMap;
    for (int i = 0; i < buyers.size(); i++) {
        cout << "\rProcessing sequences for buyer " << i + 1 << flush;
        array<char, 2001> prices { buyers[i] };
        auto buyerSequences = getSequenceProfits(prices);

        for (const auto entry : buyerSequences) {
            Sequence sequence { entry.first };

            if (sequenceProfitMap.find(sequence) == sequenceProfitMap.end()) {
                sequenceProfitMap.insert(entry);
            } else {
                sequenceProfitMap.at(sequence) += entry.second;
            }
        }
    }

    cout << endl;
    cout << "Sequences registered: " << sequenceProfitMap.size() << endl;

    Sequence bestSequence;
    int bestPrice = 0;
    for (const auto entry : sequenceProfitMap) {
        int price = entry.second;
        if (price > bestPrice) {
            bestPrice = price;
            bestSequence = entry.first;
        }
    }

    cout << "The best sequence is";
    for (const char change : bestSequence) cout << " " << (int) change;
    cout << ", it gives " << bestPrice << " bananas" << endl;
}
