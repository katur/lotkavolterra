import argparse
import csv
import json
import sys


parser = argparse.ArgumentParser(
    description="Create JSON of last year's attendees")

parser.add_argument('infile', type=argparse.FileType('r'),
                    help="CSV of last year's attendees")

args = parser.parse_args()


# Create dictionary keyed on table number, value table name and people
tables = {}

for i, row in enumerate(csv.DictReader(args.infile)):
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
        table = {}
        tables[table_number] = table
        table['number'] = table_number
        table['name'] = table_name
        table['people'] = []

    table['people'].append({'name': person_name})

NUM_TABLES_X = 8
NUM_TABLES_Y = 4

# Tranform dictionary to a list, sorted by table number
table_list = []
for table_number, table in sorted(tables.iteritems()):
    num = table_number - 1  # Go from 1-indexed to 0-indexed
    table['x'] = (num % NUM_TABLES_X) / (NUM_TABLES_X - 1.0)
    table['y'] = (num / NUM_TABLES_X) / (NUM_TABLES_Y - 1.0)
    table_list.append(table)

data = {
    'luncheon': {
        'name': 'Black Rock Luncheon: 2015',
        'tables': table_list,
        'num_tables_x': NUM_TABLES_X,
        'num_tables_y': NUM_TABLES_Y,
    }
}

json.dump(data, sys.stdout, indent=2)
