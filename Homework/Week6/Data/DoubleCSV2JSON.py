# name: Thomas Hoedeman
# student number: 10318070

from tkinter.filedialog import askopenfilename
import csv
import json

# get input paths
inputPaths = ["hpi-data-2016.csv", "worldhappiness2016.csv"]
selection = ["first", "second"]
for idx, input in enumerate(inputPaths):
    while not inputPaths[idx][-4:] == '.csv':
        print(f"Please open the {selection[idx]}.csv file")

        # input user interface
        inputPaths[idx]= askopenfilename()

# load dataSet
dataSets = []
for path in inputPaths:
    print(path)
    with open(path, "r") as csvfile:
        currentData = csv.reader(csvfile)
        dataSets.append([line for line in currentData])

# remove empty cells
for idx, data in enumerate(dataSets):
    for row_idx, row in enumerate(data):
        if row[0] == '':
            data_end = row_idx
            break
    dataSets[idx] = dataSets[idx][0:row_idx]

# select data from both datasets if countries are present in both
countries = dict()
for data in dataSets:
    for row in data[1:]:
        countries[row[0]] = 1
for data in dataSets:
    for row in data[1:]:
        countries[row[0]] += 1

selected_countries = [country for country in countries if countries[country] == 3]

outputJSON = dict()
for country_name in selected_countries:
    outputJSON[country_name] = dict()

for data in dataSets:
    headers =  data[0]
    for row in data[1:]:
        current_country = row[0]
        if current_country in selected_countries:
            for idx, column in enumerate(row):
                if headers[idx] != "Country" and "Region":

                    numb = ''.join([char for char in column if char.isdigit() or char == '.'])
                    if not numb:
                        outputJSON[current_country][headers[idx]] = column
                    else:
                        outputJSON[current_country][headers[idx]] = numb

# dump into .JSON file with the same name as .csv file
with open(f'Combination_{inputPaths[0][:-4]}_&_{inputPaths[1][:-4]}.json', 'w') as f:
    json.dump(outputJSON, f,indent=4)
