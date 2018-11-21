# name: Thomas Hoedeman
# student number: 10318070

# import
from tkinter.filedialog import askopenfilename
import json

# set input_csv to random string name to initiate while loop
input_txt =  'inputtext'

# open input dialog untill user selects a .csv file
while not input_txt[-4:] == '.txt':

    # print instruction
    print("Please open a .txt file")

    # input user interface
    input_txt = askopenfilename()


# open txt file
with open(input_txt, "r") as txtfile:

    # read data
    data = txtfile.readlines()



    # global dictionary for the data
    START_YEAR = 2008
    END_YEAR = 2018
    data_dict = {str(key): dict() for key in range(START_YEAR, END_YEAR)}

    # loop over data
    for line in data:

        # keeps track of amount of comma's passed in this line
        comma = 0

        # line[12:14] is the day, so if it is the first of the month the data will be saved
        if line[12:14] == '01':

            # initiate
            year, min, max, av = '', '', '', ''

            # loop over the line and after each comma safe a new variable
            for char in line:
                if char == ',':
                    comma += 1
                elif char == '\n':
                    break
                elif comma == 1:
                    year += char
                elif comma == 2:
                    av += char
                elif comma == 3:
                    min += char
                elif comma == 4:
                    max += char

            # put variables into dictionary
            data_dict[year[0:4]][int(year[4:6])] = {'Min' : int(min)/10,
                        'Max' : int(max)/10,
                        'Average' : int(av)/10}

# dump into .JSON file with the same name as .txt file
with open(f'{input_txt[0:-4]}.json', 'w') as f:
    json.dump(data_dict, f,indent=4)
