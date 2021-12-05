from input import input

lines = input.split("\n")

instructions = []

for str in lines:
	direction, value = str.split(" ")
	instructions.append([direction, int(value)])

depth = 0
horizontalPos = 0

for direction, value in instructions:
	
	if direction == "forward":
		horizontalPos += value
	elif direction == "up":
		depth -= value
	elif direction == "down":
		depth += value

print("depth:", depth)
print("horizontalPos:", horizontalPos)
print("multiplied:", depth * horizontalPos)