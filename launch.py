import logging

from flask import Flask, render_template, url_for

from models import Group, Table, get_random_group
from localsettings import DEBUG


app = Flask(__name__)


# Test settings
DEFAULT_NUM_GENERATIONS = 5
DEFAULT_POPULATION_SIZE = 100
PEOPLE = ('Alice', 'Bob', 'Carol', 'Django', 'Erlich', 'Freddy',
          'Georgia', 'Heidi', 'Indigo', 'Jack',)

# Test simulations
RANDOM = 'random'
ALTERNATING = 'alternating'
HALVES = 'halves'
SIMULATIONS = (RANDOM, ALTERNATING, HALVES,)


@app.route("/")
def home():
    return render_template('home.html')


@app.route("/list-simulations/")
def list_simulations():
    context = {
        'simulations': SIMULATIONS,
    }
    return render_template('list_simulations.html', **context)


@app.route("/test-simulation/<name>/")
def test_simulation(name, num_generations=DEFAULT_NUM_GENERATIONS):
    # Enable command line DEBUG logging
    logging.basicConfig(level=logging.DEBUG)

    # Create and populate Test table
    table = Table('Test')
    populate_test_table(table, name)

    # Run the simulation
    table.all_seats_interact(num_generations=num_generations)

    context = {
        'table': table,
        'num_generations': num_generations,
    }

    return render_template('test_simulation.html', **context)


# Helpers
def populate_test_table(table, name):
    if name == RANDOM:
        for person in PEOPLE:
            table.insert(person, get_random_group(),
                         DEFAULT_POPULATION_SIZE)

    elif name == ALTERNATING:
        for i, person in enumerate(PEOPLE):
            if i % 2 == 0:
                group = Group.PACK
            else:
                group = Group.HERD

            table.insert(person, group, DEFAULT_POPULATION_SIZE)

    elif name == HALVES:
        for i, person in enumerate(PEOPLE):
            if i < (len(PEOPLE) / 2):
                table.insert(person, Group.PACK, DEFAULT_POPULATION_SIZE)
            else:
                table.insert(person, Group.HERD, DEFAULT_POPULATION_SIZE)


if __name__ == "__main__":
    app.run(debug=DEBUG)
