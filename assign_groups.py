import argparse
import json
import sys

from lotkavolterra.models import get_random_group


parser = argparse.ArgumentParser(
    description='Add randomly-assigned groups to people with no group.')

parser.add_argument('infile', type=argparse.FileType('r'),
                    help=('JSON file of luncheon attendees. '
                          'Some or all missing group assignment.'))

args = parser.parse_args()

data = json.load(args.infile)

for table in data['luncheon']['tables']:
    for person in table['people']:
        if 'group' not in person:
            group = get_random_group()
            person['group'] = group.name

json.dump(data, sys.stdout, indent=2)
