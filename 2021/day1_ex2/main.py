from input import input

lines = input.split("\n")

values = []

for i in range(0, len(lines)):
	values.append(int(lines[i]))

increased = 0
decreased = 0

for i in range(3, len(values)):
	sum1 = values[i-1] + values[i-2] + values[i-3]
	sum2 = values[i] + values[i-1] + values[i-2]
	if sum1 < sum2:
		increased += 1
	elif sum1 > sum2:
		decreased += 1

print("increased:", increased)
print("decreased:", decreased)
