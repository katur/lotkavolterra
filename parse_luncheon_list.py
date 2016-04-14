import argparse
from collections import OrderedDict
import csv
import json
import sys


parser = argparse.ArgumentParser(
    description="Create JSON of last year's attendees")

parser.add_argument('csv_file', type=argparse.FileType('r'),
                    help='CSV of luncheon attendees')

parser.add_argument('json_file', type=argparse.FileType('r'),
                    help=('JSON of additional luncheon attributes: '
                          'name, table coordinates, etc.'))

args = parser.parse_args()


# Read necessary data from the json file
json_data = json.load(args.json_file)
LUNCHEON_NAME = json_data["name"]
NUM_TABLES_X = json_data["numTablesX"]
NUM_TABLES_Y = json_data["numTablesY"]
TABLE_COORDS = json_data["tableCoords"]


# Antiquated way to calculate coordinate, to get a perfect grid
def add_grid_coords(table_number, table):
    num = table_number - 1  # Go from 1-indexed to 0-indexed
    table['x'] = (num % NUM_TABLES_X) / (NUM_TABLES_X - 1.0)
    table['y'] = (num / NUM_TABLES_X) / (NUM_TABLES_Y - 1.0)


# Create dictionary keyed on table number
tables = {}

for i, row in enumerate(csv.DictReader(args.csv_file)):
    person_name = row['FIRST NAME'] + ' ' + row['LAST NAME']
    table_number = int(row['Table'])
    table_name = row['TABLE HOST']

    if not person_name or not table_number or not table_name:
        raise ValueError('Error in row {}: value missing'
                         .format(i))

    try:
        table = tables[table_number]

        # Confirm table name matches previous occurrences
        previous_name = tables[table_number]['name']
        if previous_name != table_name:
            raise ValueError(
                'Error in row {}: Table {} inconsistenty {} and {}'
                .format(i, table_number, previous_name, table_name))

    except KeyError:
        # Add table if first occurrence
        table = OrderedDict()
        table['number'] = table_number
        table['name'] = table_name
        table['x'], table['y'] = TABLE_COORDS[str(table_number)]
        table['people'] = []
        tables[table_number] = table

    table['people'].append({'name': person_name})


# Tranform dictionary to a list, sorted by table number
table_list = []
for table_number, table in sorted(tables.iteritems()):
    table_list.append(table)


# Create overall output json
data = OrderedDict()
data['name'] = LUNCHEON_NAME
data['numTablesX'] = NUM_TABLES_X
data['numTablesY'] = NUM_TABLES_Y
data['tables'] = table_list
json.dump(data, sys.stdout, indent=2)
