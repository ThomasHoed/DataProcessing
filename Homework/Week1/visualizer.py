#!/usr/bin/env python
# Name: Thomas Hoedeman
# Student number: 10318070
"""
This script visualizes data obtained from a .csv file
"""
# import needed libs
import csv
import statistics
import matplotlib.pyplot as plt

# global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}


if __name__ == "__main__":
    # open file
    with open(INPUT_CSV, "r") as csvfile:
        # read file
        movies = csv.reader(csvfile)
        # append ratings of each movie to lists under correct key year in dictionary
        for movie in movies:
            # check if value of year is actually a digit
            if movie[2].isdigit():
                # append rating to list under key of year
                data_dict[movie[2]].append(float(movie[1]))
    for year in data_dict:
        data_dict[year] = statistics.mean(data_dict[year])
    # plot all averages
    plt.plot(list((data_dict.values())))
    plt.ylabel("Average rating")
    # set x labels to years
    plt.xticks(range(len(data_dict)), list(data_dict.keys()))
    plt.xlabel("Year")
    plt.title('Average rating IMDB top 50 per year (2008 - 2017)')
    plt.show()
