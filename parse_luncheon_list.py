import argparse
import csv
import json
import sys

NUM_TABLES_X = 8
NUM_TABLES_Y = 4

TABLE_COORDS = {
    1: (
        0.0,
        0.1666666666666667,
    ),
    2: (
        0.14285714285714285,
        0.0,
    ),
    3: (
        0.2857142857142857,
        0.1666666666666667,
    ),
    4: (
        0.42857142857142855,
        0.33333333333333333,
    ),
    5: (
        0.5714285714285714,
        0.33333333333333333,
    ),
    6: (
        0.7142857142857143,
        0.0,
    ),
    7: (
        0.8571428571428571,
        0.0,
    ),
    8: (
        1.0,
        0.1666666666666667,
    ),
    9: (
        0.0,
        0.5,
    ),
    10: (
        0.14285714285714285,
        0.33333333333333333,
    ),
    11: (
        0.2857142857142857,
        0.5,
    ),
    12: (
        0.42857142857142855,
        0.6666666666666667,
    ),
    13: (
        0.5714285714285714,
        0.6666666666666667,
    ),
    14: (
        0.7142857142857143,
        0.33333333333333333,
    ),
    15: (
        0.8571428571428571,
        0.33333333333333333,
    ),
    16: (
        1.0,
        0.5,
    ),
    17: (
        0.0,
        0.83333333333333333,
    ),
    18: (
        0.14285714285714285,
        0.66666666666666666,
    ),
    19: (
        0.2857142857142857,
        0.8333333333333333,
    ),
    20: (
        0.42857142857142855,
        1.0,
    ),
    21: (
        0.5714285714285714,
        1.0,
    ),
    22: (
        0.7142857142857143,
        0.66666666666666666,
    ),
    23: (
        0.8571428571428571,
        0.66666666666666666,
    ),
    24: (
        1.0,
        0.83333333333333333,
    ),
    25: (
        0.14285714285714285,
        1.0,
    ),
    26: (
        0.7142857142857143,
        1.0,
    ),
    27: (
        0.8571428571428571,
        1.0,
    )
}


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


def add_grid_coords(table_number, table):
    num = table_number - 1  # Go from 1-indexed to 0-indexed
    table['x'] = (num % NUM_TABLES_X) / (NUM_TABLES_X - 1.0)
    table['y'] = (num / NUM_TABLES_X) / (NUM_TABLES_Y - 1.0)


def add_manual_coords(table_number, table):
    x, y = TABLE_COORDS[table_number]
    table['x'] = x
    table['y'] = y


# Tranform dictionary to a list, sorted by table number
table_list = []

for table_number, table in sorted(tables.iteritems()):
    add_manual_coords(table_number, table)
    table_list.append(table)

data = {
    'luncheon': {
        'name': 'Black Rock Luncheon: 2015',
        'tables': table_list,
        'numTablesX': NUM_TABLES_X,
        'numTablesY': NUM_TABLES_Y,
    }
}

json.dump(data, sys.stdout, indent=2)
