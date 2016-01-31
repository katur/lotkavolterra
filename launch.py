import logging

from flask import Flask, render_template, request, url_for

from models import Group, Table, get_random_group
from localsettings import DEBUG


app = Flask(__name__)


# Default sizes

DEFAULT_NUM_GENERATIONS = 5
DEFAULT_NUM_SEATS = 10
DEFAULT_POPULATION_SIZE = 100


# Test simulations

RANDOM = 'random'
ALTERNATING = 'alternating'
HALVES = 'halves'
SIMULATIONS = (RANDOM, ALTERNATING, HALVES,)


# Test people

PEOPLE = ('Alice', 'Bob', 'Carol', 'Django', 'Erlich', 'Freddy',
          'Georgia', 'Heidi', 'Indigo', 'Jack',)

def get_person(i):
    try:
        return PEOPLE[i]
    except IndexError:
        return 'Person{}'.format(i)


@app.route("/")
def home():
    return render_template('home.html')


@app.route("/list-simulations/")
def list_simulations():
    context = {
        'simulations': SIMULATIONS,
    }
    return render_template('list_simulations.html', **context)


@app.route("/test-simulation/<simulation>/")
def test_simulation(simulation):
    # Enable command line DEBUG logging
    logging.basicConfig(level=logging.DEBUG)

    num_seats, population_size, num_generations = parse_get_params()

    # Create and populate Test table
    table = Table('Test')
    populate_test_table(table, simulation, num_seats, population_size)

    # Run the simulation
    table.all_seats_interact(num_generations=num_generations)

    context = {
        'table': table,
        'num_generations': num_generations,
    }

    return render_template('test_simulation.html', **context)


# Helpers

def parse_get_params():
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


def populate_test_table(table, simulation, num_seats=DEFAULT_NUM_SEATS,
                        population_size=DEFAULT_POPULATION_SIZE):
    for i in range(num_seats):
        person = get_person(i)

        if simulation == RANDOM:
            table.insert(person, get_random_group(), population_size)

        elif simulation == ALTERNATING:
            if i % 2 == 0:
                group = Group.PACK
            else:
                group = Group.HERD

            table.insert(person, group, population_size)

        elif simulation == HALVES:
            if i < (num_seats / 2):
                table.insert(person, Group.PACK, population_size)
            else:
                table.insert(person, Group.HERD, population_size)


if __name__ == "__main__":
    app.run(debug=DEBUG)
