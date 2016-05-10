import argparse
from collections import OrderedDict
import csv
import json
import sys


parser = argparse.ArgumentParser(
    description="Create JSON of attendees")

parser.add_argument('json_file', type=argparse.FileType('r'),
                    help=('JSON of additional luncheon attributes: '
                          'name, table coordinates, etc.'))

parser.add_argument('--csv_file', type=argparse.FileType('r'),
                    help='CSV of luncheon attendees')

args = parser.parse_args()


# Parse the JSON file
json_data = json.load(args.json_file)
LUNCHEON_NAME = json_data["name"]
NUM_TABLES_X = json_data["numTablesX"]
NUM_TABLES_Y = json_data["numTablesY"]
STAGE_WIDTH = json_data["stageWidth"]
STAGE_HEIGHT = json_data["stageHeight"]
STAGE_Y = json_data["stageY"]
TABLE_COORDS = json_data["tableCoords"]


def create_table(number, name=None):
    table = OrderedDict()
    table['number'] = number
    table['x'], table['y'] = TABLE_COORDS[str(number)]
    table['people'] = []
    if name:
        table['name'] = name
    return table


tables = {}  # Keyed on table number

# Parse the CSV file
if args.csv_file:
    for i, row in enumerate(csv.DictReader(args.csv_file)):
        # Ignore last name to preserve anonymity in the served json file
        person_name = row['FIRST NAME']  # + ' ' + row['LAST NAME'][0]
        table_number = int(row['Table'])
        table_name = row['TABLE HOST']

        # Skip rows missing first name (these are for organization hosts)
        if not person_name:
            continue

        if not table_number or not table_name:
            raise ValueError('Error in row {}: value missing'
                             .format(i))

        # Fetch table if the table has already been created
        try:
            table = tables[table_number]

            # Confirm table name matches previous occurrences
            previous_name = tables[table_number]['name']
            if previous_name != table_name:
                raise ValueError(
                    'Error in row {}: Table {} inconsistenty {} and {}'
                    .format(i, table_number, previous_name, table_name))

        # Add table if first occurrence
        except KeyError:
            table = create_table(table_number, table_name)
            tables[table_number] = table

        table['people'].append({'name': person_name})

    # Tranform dictionary to a list, sorted by table number
    table_list = []
    for table_number, table in sorted(tables.iteritems()):
        table_list.append(table)

# If no CSV file, assume 24 tables of 10 nameless people
else:
    table_list = []

    # For each table
    for i in range(1, 25):
        table = create_table(i)

        # For each seat
        for j in range(1, 11):
            table['people'].append({})

        table_list.append(table)


# Create net output
data = OrderedDict()
data['name'] = LUNCHEON_NAME
data['numTablesX'] = NUM_TABLES_X
data['numTablesY'] = NUM_TABLES_Y
data['showSpecies'] = False
data['showStage'] = True
data['stageWidth'] = STAGE_WIDTH
data['stageHeight'] = STAGE_HEIGHT
data['stageY'] = STAGE_Y
data['tables'] = table_list
json.dump(data, sys.stdout, indent=2)
