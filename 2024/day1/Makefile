build: dist/part1/main dist/part2/main

dist/part1/:
	mkdir -p dist/part1/

dist/part1/main: dist/part1/ part1/main.c
	gcc part1/main.c -o dist/part1/main

dist/part2/:
	mkdir -p dist/part2/

dist/part2/main: dist/part2/ part2/main.c
	gcc part2/main.c -o dist/part2/main

part1: dist/part1/main
	./dist/part1/main

part2: dist/part2/main
	./dist/part2/main
