from matplotlib import pyplot as plt, patches
from time import sleep

from input import INPUT

ENABLE_VISUALISATION = True

points = [(int(line.split(",")[0]), int(line.split(",")[1])) for line in INPUT.split("\n")]

if ENABLE_VISUALISATION:
    plt.ion(); # Activer le mode interactif de pyplot

    fig = plt.figure();
    ax = fig.add_subplot(aspect="equal")
    shape = patches.Polygon(points)

    ax.add_patch(shape)
    ax.relim()
    ax.autoscale_view()
    plt.show()

def segmentRectangleIntersection(segment, rectangle):
    s1, s2 = segment
    r1, r2 = rectangle
    rminX = min(r1[0], r2[0])
    rminY = min(r1[1], r2[1])
    rmaxX = max(r1[0], r2[0])
    rmaxY = max(r1[1], r2[1])

    # Segment vertical
    if s1[0] == s2[0]:
        # Segment montant
        if s1[1] < s2[1]:
            if s1[1] >= rmaxY or s2[1] <= rminY:
                return False
            return rminX <= s1[0] <= rmaxX - 1
        # Segment descendant
        else:
            if s2[1] >= rmaxY or s1[1] <= rminY:
                return False
            return rminX + 1 <= s1[0] <= rmaxX

    # Segment horizontal
    elif s1[1] == s2[1]:
        # Segment vers la droite
        if s1[0] < s2[0]:
            if s1[0] >= rmaxX or s2[0] <= rminX:
                return False
            return rminY + 1 <= s1[1] <= rmaxY

        # Segment vers la gauche
        else:
            if s2[0] >= rmaxX or s1[0] <= rminX:
                return False
            return rminY <= s1[1] <= rmaxY - 1

    # Le segment doit être horizontal ou vertical
    else:
        assert False

def isRectangleValid(rectangle, lineSegments):
    for segment in lineSegments:
        if segmentRectangleIntersection(segment, rectangle):
            return False
    return True

def drawVisualisation(currentRect, bestRect):
    ax.clear()
    ax.add_patch(shape)

    if bestRect != None:
        b1, b2 = bestRect
        dx = abs(b1[0] - b2[0])
        dy = abs(b1[1] - b2[1])
        minX = min(b1[0], b2[0])
        minY = min(b1[1], b2[1])

        rectPatch = patches.Rectangle((minX, minY), dx, dy, edgecolor="#0C0", fill=False)
        ax.add_patch(rectPatch)

    if currentRect != None:
        c1, c2 = currentRect
        dx = abs(c1[0] - c2[0])
        dy = abs(c1[1] - c2[1])
        minX = min(c1[0], c2[0])
        minY = min(c1[1], c2[1])

        rectPatch = patches.Rectangle((minX, minY), dx, dy, edgecolor="red", fill=False)
        ax.add_patch(rectPatch)

    ax.relim()
    ax.autoscale_view()
    fig.canvas.draw()
    fig.canvas.flush_events()

lineSegments = []
for i in range(len(points) - 1):
    lineSegments.append((points[i], points[i+1]))
lineSegments.append((points[-1], points[0]))

largestArea = 0
largestRect = None

for i in range(len(points) - 1):
    for j in range(i + 1, len(points)):
        p1 = points[i]
        p2 = points[j]

        if not isRectangleValid((p1, p2), lineSegments):
            continue

        dx = abs(p1[0] - p2[0])
        dy = abs(p1[1] - p2[1])
        rectArea = (dx + 1) * (dy + 1)

        if rectArea > largestArea:
            largestArea = rectArea
            largestRect = (p1, p2)

        # Ne pas dessiner la visualisation à chaque fois pour ne pas trop ralentir le calcul
        if ENABLE_VISUALISATION and j % 3 == 0:
            drawVisualisation((p1, p2), largestRect)

print("Aire de plus grand rectangle:", largestArea)

if ENABLE_VISUALISATION:
    drawVisualisation(None, largestRect)
    sleep(2)

