build: dist/part1/main

dist/part1/:
	mkdir -p dist/part1/

dist/part1/main: dist/part1/ part1/main.cpp
	g++ part1/main.cpp -o dist/part1/main

part1: dist/part1/main
	./dist/part1/main
