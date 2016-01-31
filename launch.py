import logging

from flask import Flask

from models import Group, Table
from localsettings import DEBUG


app = Flask(__name__)


def get_interaction_html(table):
    output = '<h3>Initial state</h3>'
    output += get_seats_as_ul(table.get_seats())
    table.all_seats_interact(num_generations=5)
    output += '<h3>Final state</h3>'
    output += get_seats_as_ul(table.get_seats())
    return output


def get_seats_as_ul(seats):
    output = '<table>'
    for seat in seats:
        output += '<tr><td>{}</td><td>{}</td></tr>'.format(
            seat, seat.population_size)
    output += '</table>'
    return output


@app.route("/")
def hello_mars():
    return "Hello Mars!"


@app.route("/simulate-random")
def simulate_random():
    logging.basicConfig(level=logging.DEBUG)

    x = Table(1)
    x.insert('alice', Group.PACK, 100)
    x.insert('bob', Group.COLONY, 100)
    x.insert('carol', Group.PACK, 100)
    x.insert('django', Group.HERD, 100)
    x.insert('erlich', Group.HERD, 100)
    x.insert('freddy', Group.HERD, 100)
    x.insert('georgia', Group.COLONY, 100)
    x.insert('heidi', Group.PACK, 100)
    x.insert('indigo', Group.COLONY, 100)
    x.insert('jack', Group.PACK, 100)

    return get_interaction_html(x)


@app.route("/simulate-alternating")
def simulate_alternating():
    logging.basicConfig(level=logging.DEBUG)

    x = Table(1)
    x.insert('alice', Group.PACK, 100)
    x.insert('bob', Group.HERD, 100)
    x.insert('carol', Group.PACK, 100)
    x.insert('django', Group.HERD, 100)
    x.insert('erlich', Group.PACK, 100)
    x.insert('freddy', Group.HERD, 100)
    x.insert('georgia', Group.PACK, 100)
    x.insert('heidi', Group.HERD, 100)
    x.insert('indigo', Group.PACK, 100)
    x.insert('jack', Group.HERD, 100)

    return get_interaction_html(x)


@app.route("/simulate-halves")
def simulate_halves():
    logging.basicConfig(level=logging.DEBUG)

    x = Table(1)
    x.insert('alice', Group.PACK, 100)
    x.insert('bob', Group.PACK, 100)
    x.insert('carol', Group.PACK, 100)
    x.insert('django', Group.PACK, 100)
    x.insert('erlich', Group.PACK, 100)
    x.insert('freddy', Group.HERD, 100)
    x.insert('georgia', Group.HERD, 100)
    x.insert('heidi', Group.HERD, 100)
    x.insert('indigo', Group.HERD, 100)
    x.insert('jack', Group.HERD, 100)

    return get_interaction_html(x)


if __name__ == "__main__":
    app.run(debug=DEBUG)
