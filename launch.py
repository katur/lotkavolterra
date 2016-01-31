import logging

from flask import Flask, url_for

from models import Group, Table, get_random_group
from localsettings import DEBUG


app = Flask(__name__)


# Test settings
PEOPLE = ('Alice', 'Bob', 'Carol', 'Django', 'Erlich', 'Freddy',
          'Georgia', 'Heidi', 'Indigo', 'Jack',)
NUM_GENERATIONS = 5
POPULATION_SIZE = 100


# Test simulations
RANDOM = 'random'
ALTERNATING = 'alternating'
HALVES = 'halves'
SIMULATIONS = (RANDOM, ALTERNATING, HALVES,)


@app.route("/")
def home():
    output = '<h1>Lotka-Volterra Game</h1>'
    output += '<a href="{}">View simulations</a>'.format(
        url_for('list_test_simulations'))
    return output


@app.route("/test-simulations/")
def list_test_simulations():
    output = '<h1>Test simulations</h1>'
    output += '<ul>'
    for simulation in SIMULATIONS:
        output += '<li><a href="{}">{}</a></li>'.format(
            url_for('test_simulation', name=simulation), simulation)

    output += '</ul>'
    return output


@app.route("/test-simulation/<name>/")
def test_simulation(name):
    logging.basicConfig(level=logging.DEBUG)

    table = Table(1)

    populate_test_table(table, name)

    return get_interaction_html(table, NUM_GENERATIONS)


# Helpers
def populate_test_table(table, name):
    if name == RANDOM:
        for person in PEOPLE:
            table.insert(person, get_random_group(), POPULATION_SIZE)

    elif name == ALTERNATING:
        for i, person in enumerate(PEOPLE):
            if i % 2 == 0:
                group = Group.PACK
            else:
                group = Group.HERD

            table.insert(person, group, POPULATION_SIZE)

    elif name == HALVES:
        for i, person in enumerate(PEOPLE):
            if i < (len(PEOPLE) / 2):
                table.insert(person, Group.PACK, POPULATION_SIZE)
            else:
                table.insert(person, Group.HERD, POPULATION_SIZE)


def get_interaction_html(table, num_generations):
    output = '<h3>Initial state</h3>'
    output += get_seats_html(table.get_seats())

    output += '<h3>... simulating {} generations ...</h3>'.format(
        num_generations)
    table.all_seats_interact(num_generations=num_generations)

    output += '<h3>Final state</h3>'
    output += get_seats_html(table.get_seats())
    return output


def get_seats_html(seats):
    output = '<table>'
    for seat in seats:
        output += '<tr><td>{}</td><td>{}</td></tr>'.format(
            seat, seat.population_size)
    output += '</table>'
    return output


if __name__ == "__main__":
    app.run(debug=DEBUG)
