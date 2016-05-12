import argparse
from collections import OrderedDict
import csv
import json
import sys


parser = argparse.ArgumentParser(
    description="Export sticker colors from list")

parser.add_argument('csv_file', type=argparse.FileType('r'),
                    help='CSV of luncheon attendees')

parser.add_argument('json_file', type=argparse.FileType('r'),
                    help=('JSON with assignments (first names only).'))

args = parser.parse_args()


# Parse the JSON file
json_data = json.load(args.json_file)

tables = {}  # Keyed on table number

for table in json_data['tables']:
    table_number = table['number']
    people = {}
    for person in table['people']:
        name = person['name']
        group = person['group']

        if name in people:
            group = '~~~~~~CONFLICT~~~~~~ {} table {}'.format(
                name, table_number)

        people[name] = group

    tables[table_number] = people

# Parse the CSV file
for i, row in enumerate(csv.DictReader(args.csv_file)):
    first_name = row['FIRST NAME']

    # Skip rows missing first name (these are for organization hosts)
    if not first_name:
        continue

    last_name = row['LAST NAME']
    table_number = int(row['Table'])
    table_name = row['TABLE HOST']

    group = tables[table_number][first_name]

    if group == 'PACK':
        color = 'red'
    elif group == 'HERD':
        color = 'green'
    elif group == 'COLONY':
        color = 'blue'
    else:
        color = group

    sys.stdout.write('{},{},{},{}\n'.format(last_name, first_name,
                                            table_number, color))
