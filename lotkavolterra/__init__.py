from enum import Enum
import json
from os.path import isfile, join

from flask import Flask, render_template, request

from .models import (Luncheon, Table, Group, get_random_group,
                     OVERPOPULATION_FACTOR)
from .utils import listdir_json

DEFAULTS = {
    'num_generations': 25,
    'population_size': 1000,
    'num_seats': 10,  # This one used for test case simulations only
}

app = Flask(__name__, instance_relative_config=True)

# Load the default configuration
app.config.from_object('config.default')

# Load the instance / local configuration
app.config.from_pyfile('config.py')

# Load configuration specified in environment variable, if any
try:
    app.config.from_envvar('APP_CONFIG_FILE')
except Exception as e:
    pass


@app.route("/")
def home():
    """
    Render the homepage.
    """
    return render_template('home.html')


@app.route("/list-simulations/")
def list_simulations():
    """
    Render the page listing the simulations.
    """
    simulations = [f.split('.')[0]
                   for f in listdir_json(app.config['INPUT_DIR'])
                   if isfile(join(app.config['INPUT_DIR'], f))]
    context = {
        'simulations': simulations,
        'defaults': DEFAULTS,
    }
    return render_template('list_simulations.html', **context)


@app.route("/run-simulation/")
def run_simulation():
    """
    Run the simulation from an input file.
    """
    simulation = request.args['simulation']
    num_generations = int(request.args['num_generations'])
    population_size = int(request.args['population_size'])
    has_stage = 'stage' in request.args

    # Read the input file
    with open(join(app.config['INPUT_DIR'], simulation + '.json'), 'r') as f:
        json_data = json.loads(f.read())

    # Create the luncheon object
    json_luncheon = json_data['luncheon']
    luncheon = Luncheon(json_luncheon['name'],
                        json_luncheon['num_tables_x'],
                        json_luncheon['num_tables_y'])

    # Incrementing per-person primary key
    pk = 0

    # Populate tables from the json input
    for json_table in json_luncheon['tables']:
        table = Table(**json_table)

        for index, person in enumerate(json_table['people']):
            try:
                group = Group[person['group']]
            except KeyError:
                group = get_random_group()

            table.insert(pk, index, person['name'],
                         group, population_size)
            pk += 1

        luncheon.add_table(table)

    # Save initial state
    initial_state = luncheon.export_seat_states()

    # Interact for num_generations
    changes = []
    for generation in range(num_generations):
        luncheon.all_seats_interact()
        changes.append(luncheon.export_seat_sizes())

    context = {
        'luncheon': luncheon,
        'has_stage': has_stage,
        'initial_state': initial_state,
        'changes': changes,

        # For the GET param form
        'num_generations': num_generations,
        'population_size': population_size,

        # For size calculations
        'OVERPOPULATION_FACTOR': OVERPOPULATION_FACTOR,
    }

    return render_template('run_simulation.html', **context)


class TestSimulation(Enum):
    """
    A type of test simulation.
    """
    random, alternating, halves = range(3)


@app.route("/list-test-simulations")
def list_test_simulations():
    """
    Render the page listing the test case simulations.
    """
    simulations = [t.name for t in TestSimulation]

    context = {
        'simulations': simulations,
        'defaults': DEFAULTS,
        'show_num_seats': True,
    }
    return render_template('list_test_simulations.html', **context)


@app.route("/test-simulation/")
def run_test_simulation():
    """
    Run a test simulation.

    This is very similar to run_simulation, but instead of parsing
    a json file it creates a test table based on rules.
    """
    simulation = TestSimulation[request.args['simulation']]
    num_generations = int(request.args['num_generations'])
    population_size = int(request.args['population_size'])
    num_seats = int(request.args['num_seats'])

    luncheon = Luncheon(simulation, 2, 2)
    table = Table(x=0.5, y=0.25)
    _populate_test_table(table, simulation, num_seats, population_size)
    luncheon.add_table(table)

    initial_state = luncheon.export_seat_states()

    changes = []
    for generation in range(num_generations):
        luncheon.all_seats_interact()
        changes.append(luncheon.export_seat_sizes())

    context = {
        'luncheon': luncheon,
        'initial_state': initial_state,
        'changes': changes,

        # Needed to set the GET param form
        'num_generations': num_generations,
        'population_size': population_size,
        'num_seats': num_seats,

        # Needed for drawing calculations
        'OVERPOPULATION_FACTOR': OVERPOPULATION_FACTOR,
    }

    return render_template('run_simulation.html', **context)


def _populate_test_table(table, simulation, num_seats, population_size):
    """
    Helper function to populate a test table for a test simulation.
    """
    PEOPLE = ('Alice', 'Bob', 'Carol', 'Django', 'Erlich', 'Freddy',
              'Georgia', 'Heidi', 'Indigo', 'Jack',)

    for i in range(num_seats):
        pk = i
        index = i

        try:
            name = PEOPLE[i]
        except IndexError:
            name = 'Person{}'.format(i)

        if simulation == TestSimulation.random:
            group = get_random_group()

        elif simulation == TestSimulation.alternating:
            if i % 2 == 0:
                group = Group.pack
            else:
                group = Group.herd

        elif simulation == TestSimulation.halves:
            if i < (num_seats / 2):
                group = Group.pack
            else:
                group = Group.herd

        else:
            raise ValueError('Unknown test simulation')

        table.insert(pk, index, name, group, population_size)


############
# D3 Demos #
############

@app.route("/d3-demo/circles-of-circles/")
def d3_demo_circles_of_circles():
    return render_template('d3_demo_circles_of_circles.html')


@app.route("/d3-demo/random-circles/")
def d3_demo_random_circles():
    return render_template('d3_demo_random_circles.html')
