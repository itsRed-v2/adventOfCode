build: dist/part1/main dist/part2/main

dist/part1/:
	mkdir -p dist/part1/

dist/part1/main: dist/part1/ part1/main.cpp
	g++ part1/main.cpp -o dist/part1/main

dist/part2/:
	mkdir -p dist/part2/

dist/part2/main: dist/part2/ part2/main.cpp
	g++ part2/main.cpp -o dist/part2/main

dist/part2/generate-graph: dist/part2/ part2/generate-graph.cpp
	g++ part2/generate-graph.cpp -o dist/part2/generate-graph

part1: dist/part1/main
	./dist/part1/main

part2: dist/part2/main dist/part2/generate-graph
	./dist/part2/main
	./dist/part2/generate-graph
