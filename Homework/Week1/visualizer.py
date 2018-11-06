#!/usr/bin/env python
# Name: Thomas Hoedeman
# Student number: 10318070
"""
This script visualizes data obtained from a .csv file
"""

import csv
import statistics
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

if __name__ == "__main__":
    filename = "movies.csv"
    with open(filename, "r") as csvfile:
        movies = csv.reader(csvfile)
        for movie in movies:
            if movie[2].isdigit():
                data_dict[movie[2]].append(float(movie[1]))

    print(data_dict)
    for year in data_dict:
        data_dict[year] = statistics.mean(data_dict[year])
    plt.plot(list((data_dict.values())))
    plt.ylabel("Average rating")
    plt.xticks(range(len(data_dict)), list(data_dict.keys()))
    plt.xlabel("Year")
    plt.show()
