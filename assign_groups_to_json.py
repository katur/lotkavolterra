import argparse
from collections import OrderedDict
import json
import random
import sys


parser = argparse.ArgumentParser(
    description='Add randomly-assigned groups to people with no group.')

parser.add_argument('infile', type=argparse.FileType('r'),
                    help=('JSON file of luncheon attendees. '
                          'Some or all missing group assignment.'))

args = parser.parse_args()

# Preserve order of json by using an OrderedDict
data = json.load(args.infile, object_pairs_hook=OrderedDict)

for table in data['luncheon']['tables']:
    for person in table['people']:
        if 'group' not in person:
            person['group'] = random.choice(['HERD', 'PACK', 'COLONY'])

json.dump(data, sys.stdout, indent=2)
