from csv import reader
from sys import stdin
from json import dumps

data = list(reader(stdin))
for d in data:
    if type(d) is not list or len(d) != 2:
        raise ValueError(f"Each item must be a list containing exactly one clue and one answer: {d}")
print(dumps(data))
