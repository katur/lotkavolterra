import json

from flask import render_template, request

from lotkavolterra import app
from lotkavolterra.models import Group, Table, get_random_group


# Default sizes

DEFAULT_NUM_GENERATIONS = 20
DEFAULT_POPULATION_SIZE = 1000


# Test simulations

DEFAULT_NUM_SEATS = 10
RANDOM = 'random'
ALTERNATING = 'alternating'
HALVES = 'halves'
PEOPLE = ('Alice', 'Bob', 'Carol', 'Django', 'Erlich', 'Freddy',
          'Georgia', 'Heidi', 'Indigo', 'Jack',)


@app.route("/")
def home():
    return render_template('home.html')


@app.route("/test-simulations/")
def list_test_simulations():
    context = {
        'simulations': (RANDOM, ALTERNATING, HALVES,),
    }
    return render_template('list_test_simulations.html', **context)


@app.route("/input-simulations/")
def list_input_simulations():
    context = {
        'inputs': ('familiar',),
    }
    return render_template('list_input_simulations.html', **context)


@app.route("/test-simulation/<simulation_name>/")
def run_test_simulation(simulation_name):
    """
    Run a test simulation.
    """
    # Uncomment to command line DEBUG logging
    # logging.basicConfig(level=logging.DEBUG)

    num_seats, population_size, num_generations = _parse_get_params()

    # Create and populate Test table
    table = Table('Test', 600, 300)
    _populate_test_table(table, simulation_name, num_seats, population_size)

    # Save initial state
    initial_state = table.export_state()

    # Interact for num_generations
    changes = []
    for generation in range(num_generations):
        table.all_seats_interact()
        changes.append(table.export_current_sizes())

    context = {
        'simulation_name': simulation_name,
        'num_seats': num_seats,
        'num_generations': num_generations,
        'population_size': population_size,
        'initial_state': initial_state,
        'changes': changes,
        'table': table,
    }

    return render_template('run_test_simulation.html', **context)


@app.route("/input-simulation/<input_file>/")
def run_input_simulation(input_file):
    """
    Run the simulation from an input file.
    """
    with open(input_file + '.json', 'r') as f:
        json_data = json.loads(f.read())

    json_tables = json_data['tables']
    current_pk = 0
    tables = []

    for table_name, table_info in json_tables.iteritems():
        table = Table(table_name,
                      xcoordinate=table_info['xcoordinate'],
                      ycoordinate=table_info['ycoordinate'])

        tables.append(table)

        for index, person in enumerate(table_info['people']):
            table.insert(current_pk, index, person,
                         get_random_group(),
                         DEFAULT_POPULATION_SIZE)
            current_pk += 1

    initial_states = []
    for table in tables:
        initial_states.append(table.export_state())

    context = {
        'tables': tables,
        'initial_states': initial_states,
    }

    return render_template('run_input_simulation.html', **context)


###########
# Helpers #
###########

def _parse_get_params():
    try:
        num_seats = int(request.args['num_seats'])
    except Exception:
        num_seats = DEFAULT_NUM_SEATS

    try:
        population_size = int(request.args['population_size'])
    except Exception:
        population_size = DEFAULT_POPULATION_SIZE

    try:
        num_generations = int(request.args['num_generations'])
    except Exception:
        num_generations = DEFAULT_NUM_GENERATIONS

    return (num_seats, population_size, num_generations)


def _populate_test_table(table, simulation, num_seats=DEFAULT_NUM_SEATS,
                         population_size=DEFAULT_POPULATION_SIZE):
    for i in range(num_seats):
        pk = i
        index = i

        try:
            name = PEOPLE[i]
        except IndexError:
            name = 'Person{}'.format(i)

        if simulation == RANDOM:
            table.insert(pk, index, name, get_random_group(),
                         population_size)

        elif simulation == ALTERNATING:
            if i % 2 == 0:
                group = Group.pack
            else:
                group = Group.herd

            table.insert(pk, index, name, group, population_size)

        elif simulation == HALVES:
            if i < (num_seats / 2):
                table.insert(pk, index, name, Group.pack, population_size)
            else:
                table.insert(pk, index, name, Group.herd, population_size)


############
# D3 Demos #
############

@app.route("/d3-demos/")
def list_d3_demos():
    return render_template('list_d3_demos.html')


@app.route("/d3-demo/circles-of-circles/")
def d3_demo_circles_of_circles():
    return render_template('d3_demo_circles_of_circles.html')


@app.route("/d3-demo/random-circles/")
def d3_demo_random_circles():
    return render_template('d3_demo_random_circles.html')
