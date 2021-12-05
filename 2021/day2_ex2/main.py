from input import input

lines = input.split("\n")

instructions = []

for str in lines:
	direction, value = str.split(" ")
	instructions.append([direction, int(value)])

depth = 0
horizontalPos = 0
aim = 0

for direction, value in instructions:
	
	if direction == "forward":
		horizontalPos += value
		depth += aim * value
	elif direction == "up":
		aim -= value
	elif direction == "down":
		aim += value

print("depth:", depth)
print("horizontalPos:", horizontalPos)
print("multiplied:", depth * horizontalPos)