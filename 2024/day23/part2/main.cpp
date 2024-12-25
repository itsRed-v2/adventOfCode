#include <iostream>
#include <fstream>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <set>
#include <vector>
#include <algorithm>

using namespace std;

vector<string> getNeighbors(string computer, const unordered_multimap<string, string> &connections) {
    auto range { connections.equal_range(computer) };
    vector<string> neighbors;
    for (auto it = range.first; it != range.second; it++) {
        neighbors.push_back(it->second);
    }
    return neighbors;
}

bool connectionExists(string computer1, string computer2, const unordered_multimap<string, string> &connections) {
    auto range { connections.equal_range(computer1) };
    for (auto it = range.first; it != range.second; it++) {
        if (it->second == computer2) return true;
    }
    return false;
}

bool isConnectedToCluster(string computer, const set<string> &cluster, const unordered_multimap<string, string> &connections) {
    for (string clusterMember : cluster) {
        if (clusterMember == computer) continue;
        if (!connectionExists(computer, clusterMember, connections)) return false;
    }
    return true;
}

int main() {
    ifstream inputFile ("input.txt");
    if (!inputFile.is_open()) {
        cout << "Error when reading input file" << endl;
        return 1;
    }

    unordered_multimap<string, string> connections;
    unordered_set<string> computers;

    string line;
    while (getline(inputFile, line)) {
        string computer1 { line.substr(0, 2) };
        string computer2 { line.substr(3, 2) };
        connections.insert({computer1, computer2});
        connections.insert({computer2, computer1});
        computers.insert(computer1);
        computers.insert(computer2);
    }

    cout << computers.size() << " computers registered" << endl;

    set<set<string>> clusters;

    for (string computer : computers) {
        clusters.insert(set{computer});
    }

    for (string computer : computers) {
        set<set<string>> newClusters;
        for (set<string> cluster : clusters) {
            if (isConnectedToCluster(computer, cluster, connections)) {
                cluster.insert(computer);
            }
            newClusters.insert(cluster);
        }
        clusters = newClusters;
    }

    set<string> largestCluster = *clusters.begin();
    for (const set<string> cluster : clusters) {
        if (cluster.size() > largestCluster.size()) {
            largestCluster = cluster;
        }
    }

    vector<string> clusterArray(largestCluster.begin(), largestCluster.end());
    // On trie le vecteur (par défaut, le tri de string est par ordre alphabétique)
    // Techniquement, le vecteur des déjà trié car il est construit à partir d'un set trié, mais bon
    sort(clusterArray.begin(), clusterArray.end());

    cout << "Largest cluster: (" << clusterArray.size() << " computers)" << endl;
    for (int i = 0; i < clusterArray.size(); i++) {
        if (i != 0) cout << ",";
        cout << clusterArray[i];
    }
    cout << endl;

}
