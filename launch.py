import logging

from flask import Flask

from models import Group, Table, get_random_group
from localsettings import DEBUG


app = Flask(__name__)


NUM_GENERATIONS = 5
POPULATION_SIZE = 100
PEOPLE = ('Alice', 'Bob', 'Carol', 'Django', 'Erlich', 'Freddy',
          'Georgia', 'Heidi', 'Indigo', 'Jack')


@app.route("/")
def hello_mars():
    return "Hello Mars!"


@app.route("/simulate-random")
def simulate_random():
    logging.basicConfig(level=logging.DEBUG)

    table = Table(1)

    for person in PEOPLE:
        table.insert(person, get_random_group(), POPULATION_SIZE)

    return get_interaction_html(table, NUM_GENERATIONS)


@app.route("/simulate-alternating")
def simulate_alternating():
    logging.basicConfig(level=logging.DEBUG)

    table = Table(1)

    for i, person in enumerate(PEOPLE):
        if i % 2 == 0:
            group = Group.PACK
        else:
            group = Group.HERD

        table.insert(person, group, POPULATION_SIZE)

    return get_interaction_html(table, NUM_GENERATIONS)


@app.route("/simulate-halves")
def simulate_halves():
    logging.basicConfig(level=logging.DEBUG)

    table = Table(1)
    for i, person in enumerate(PEOPLE):
        if i < (len(PEOPLE) / 2):
            table.insert(person, Group.PACK, POPULATION_SIZE)
        else:
            table.insert(person, Group.HERD, POPULATION_SIZE)

    return get_interaction_html(table, NUM_GENERATIONS)


# Helpers
def get_interaction_html(table, num_generations):
    output = '<h3>Initial state</h3>'
    output += get_seats_html(table.get_seats())
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
