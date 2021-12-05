from input import input

lines = input.split("\n")

ones = []
zeros = []
for i in range(12):
	ones.append(0)
	zeros.append(0)

for string in lines:
	for i in range(len(string)):
		if string[i] == "1":
			ones[i] += 1
		else:
			zeros[i] += 1

print("ones:", ones)
print("zeros:", zeros)

gammaRate = ""
epsilonRate = ""

for i in range(12):
	if ones[i] > zeros[i]:
		gammaRate += "1"
		epsilonRate += "0"
	else:
		gammaRate += "0"
		epsilonRate += "1"

print("gammaRate:", gammaRate)
print("epsilonRate:", epsilonRate)
