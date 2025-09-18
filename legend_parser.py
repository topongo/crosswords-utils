from json import load
from sys import stdin

data = load(stdin)

for (l, k) in (("Orizzontali", "across"), ("Verticali", "down")):
    print(f"{l}:")
    for (i, e) in enumerate(data[k], 1):
        print(f"{i:2}. {e['clue']}")
