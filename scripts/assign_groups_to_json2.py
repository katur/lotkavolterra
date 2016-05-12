import argparse
from collections import OrderedDict
import json
import random
import sys


parser = argparse.ArgumentParser(
    description='Add groups from other json to json without groups.')

parser.add_argument('infile', type=argparse.FileType('r'),
                    help=('JSON file of luncheon attendees. '
                          'Some or all missing group assignment.'))

parser.add_argument('preassignments', type=argparse.FileType('r'),
                    help=('JSON file with some preassignments'))

args = parser.parse_args()

# Preserve order of json by using an OrderedDict
data = json.load(args.infile, object_pairs_hook=OrderedDict)
preassignments = json.load(args.preassignments, object_pairs_hook=OrderedDict)

pa = {}
for table in preassignments['tables']:
    assignments = [i['group'] for i in table['people']]
    pa[table['number']] = assignments

for table in data['tables']:
    for i, person in enumerate(table['people']):
        if 'group' not in person:
            try:
                person['group'] = pa[table['number']][i]
            except (IndexError, KeyError):
                person['group'] = random.choice(['HERD', 'PACK', 'COLONY'])

json.dump(data, sys.stdout, indent=2)
