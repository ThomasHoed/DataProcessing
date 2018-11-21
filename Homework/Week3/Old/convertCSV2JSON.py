# name: Thomas Hoedeman
# student number: 10318070

# import
from tkinter.filedialog import askopenfilename
import csv
import json

# set input_csv to random string name to initiate while loop
input_csv =  'filename'

# open input dialog untill user selects a .csv file
while not input_csv[-4:] == '.csv':

    # print instruction
    print("Please open a .csv file")

    # input user interface
    input_csv = askopenfilename()

# open csv file
with open(input_csv, "r") as csvfile:

    # read data
    data = csv.reader(csvfile)

    # remove white lines if present
    data = [line for line in data if line != []]


# loop over data set missing values to NULL, convert numbers to floats
for r, row in enumerate(data):
    for c, col in enumerate(row):

        # set missing values to NULL
        if not col or col == '.':
            data[r][c] = 'NULL'

        # replace ',' with '.' to be able to convert to float
        elif ',' in col and any(char.isdigit() for char in col) and not any(char.isalpha() for char in col):
            # replace
            data[r][c] = data[r][c].replace(',', '.')
            # convert to float
            data[r][c] = float(data[r][c])

        # convert whole numbers (numbers without a comma/floating point) to float
        elif col.isdigit():
            data[r][c] = float(data[r][c])

# create a dictionary with each category as header
dict_data = {str(key) : [] for key in data[0] if key != 'NULL'}

# create dictionary with all info for each key in dictionary
for numb, key in enumerate(dict_data, 1):

    # initiate dictionary that will be placed in larger dict
    dict = dict()

    # loop over data column and create dictionary with all information
    for info in data[1:]:
        dict[info[0]] = info[numb]

    # place dictionary holding info for one category in larger dictionary  of all categories
    dict_data[key] = dict

    # delete dict variable to be able to restart loop
    del dict


# dump into .JSON file with the same name as .csv file
with open(f'{input_csv[0:-4]}.json', 'w') as f:
    json.dump(dict_data, f,indent=4)







# converts a csv file to a JSON file


# input dlg for CSV file

# parse CSV data into python object

# convert object to JSON object

# save JSOn file
