# name: Thomas Hoedeman
# student number: 10318070

# import
import csv
from pandas import DataFrame
import statistics
import matplotlib.pyplot as plt
import json

# input file
INPUT_CSV = "input.csv"

# open csv file
with open(INPUT_CSV, "r") as csvfile:

    # read lines
    data = csv.reader(csvfile)

    # remove white lines
    data = [line for line in data if line != []]

    # loop over data set missing values to nan, convert numbers to floats
    for r, row in enumerate(data):
        for c, col in enumerate(row):

            # set missing numbers to nan
            if not col or col =="unknown" or col == '':
                data[r][c] = float('nan')

            # replace , with . to be able to convert to float
            if ',' in col and any(char.isdigit() for char in col):
                data[r][c] = data[r][c].replace(',', '.')
                data[r][c] = float(data[r][c])

            # convert whole numbers to float
            elif col.isdigit():
                data[r][c] = float(data[r][c])

    # set dataframe
    df = DataFrame(data=data[1:-1], columns=data[0])

    # remove ' dollars' string and transform
    for idx, value in enumerate(df[df.columns[8]]):
        # check if not nan
        if not isinstance(value, float):
                df.loc[idx,(df.columns[8])] = float(value.replace(' dollars', ''))

    #remove whitespaces from regions
    for idx, region in enumerate(df[df.columns[1]]):
        df.loc[idx, (df.columns[1])] = region.strip()


    # get and print Mean (M), standard deviation (STD), Median (MED) and Mode (MODE).
    # header
    print(f"{df.columns[8]}: ")

    # mean
    M = df[df.columns[8]].mean()
    print(f'Mean: {round(M, 2)}')

    # standard deviation
    STD = df[df.columns[8]].std()
    print(f'Standard deviation: {round(STD, 2)}')

    # median
    MED = df[df.columns[8]].median()
    print(f'Median: {MED}')

    # mode
    MODE = df[df.columns[8]].mode()[0]
    print(f'Mode: {MODE}')

    # logical indexing to select data without outliers
    x = df[df.columns[8]][df[df.columns[8]] - M <= 3 * STD]

    # plot histogram using logically indexing to only plot data without outliers
    # df[df.columns[8]][df[df.columns[8]] - M <= 3 * STD].plot.hist(range(0, int(x.max()), 1000))
    # plt.xlabel('Gross domestic product (GDP) per capita per year in dollars, (range of bins: $1000)')
    # plt.ylabel('Number of countries')
    # plt.show()

    # get five number summary
    MED = df[df.columns[7]].median()
    MAX = df[df.columns[7]].max()
    MIN = df[df.columns[7]].min()
    FQ = df[df.columns[7]].quantile(q=0.25)
    TQ = df[df.columns[7]].quantile(q=0.75)

    # print info
    print("")
    print(f"{df.columns[7]}: ")
    print(f"Median: {MED}")
    print(f"Max: {MAX}")
    print(f"Min: {MIN}")
    print(f"First quartile: {round(FQ,2)}")
    print(f"Thrid quartile: {round(TQ,2)}")

    # plot boxplot
    # df[df.columns[7]].plot(kind='box')
    # plt.show()

    # initiate dict
    data = dict()
    # loop over df data and get country info
    for i in range(len(df)):

        # get information of single country
        current_country = df.ix[i]

        # get info per country
        inner_info = {f'{df.columns[1]}':f'{current_country[df.columns[1]]}',
                    f'{df.columns[4]}': f'{current_country[df.columns[4]]}',
                    f'{df.columns[7]}': f'{current_country[df.columns[7]]}',
                    f'{df.columns[8]}': f'{current_country[df.columns[8]]}'}

        # add to dict with country name as key
        data[f'{current_country[df.columns[0]]}'] = inner_info

    # convert to json
    json_data = json.dumps(data, sort_keys=True,indent=4)

    # write to json file
    with open('output.json', 'w') as f:
        json.dump(json_data, f)
