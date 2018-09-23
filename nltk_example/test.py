import sys
import os

k = open("example_text.txt", 'r')

m = k.readlines()

print("Number of Lines in file: ", len(m))
for i, line in enumerate(m): 
    if line.strip() != ' ' and line.strip() != '\n' and line.strip() != '\t' and i % 2 == 0:
        print(i, line, '\nend\n')

