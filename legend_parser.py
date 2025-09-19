from json import load
from sys import stdin

data = load(stdin)

for (l, k) in (("Orizzontali", "across"), ("Verticali", "down")):
    print(f"{l}:")
    for e in data[k]:
        print(f"{e['position']:2}. {e['clue']}")
