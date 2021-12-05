from input import input

lignes = input.split("\n")

increased = 0
decreased = 0

previousDepth = None

for strDepth in lignes:
	if previousDepth == None: 
		previousDepth = int(strDepth)
		continue

	depth = int(strDepth)

	if depth > previousDepth:
		increased += 1
	if depth < previousDepth:
		decreased += 1

	previousDepth = depth

print("increased:", increased)
print("decreased:", decreased)