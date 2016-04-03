import os
from os import listdir

from flask import Flask, render_template, request


DEFAULTS = {
    'num_generations': 25,
    'population_size': 1000,
    'num_seats': 10,  # This one used for test case simulations only
}


######################
# Set up application #
######################

app = Flask(__name__, instance_relative_config=True)

# Load the default configuration
app.config.from_object('config.default')

# Load the instance / local configuration
app.config.from_pyfile('config.py')

# Load configuration specified in environment variable, if any
try:
    app.config.from_envvar('APP_CONFIG_FILE')
except:
    pass


###########################
# Define views and routes #
###########################

@app.route("/")
def home():
    """
    Render the homepage.
    """
    return render_template('home.html')


def _listdir_json(path):
    """
    List only the .json files in path.
    """
    for f in listdir(path):
        if not f.startswith('.') and f.endswith('.json'):
            yield f


@app.route("/list-simulations/")
def list_simulations():
    """
    Render the page listing the simulations.
    """
    simulations = [
        os.path.splitext(filename)[0]
        for filename in _listdir_json(os.path.join(app.static_folder, 'json'))
        if os.path.isfile(os.path.join(app.static_folder, 'json', filename))
    ]

    context = {
        'simulations': simulations,
        'defaults': DEFAULTS,
    }
    return render_template('list_simulations.html', **context)


@app.route("/list-test-simulations")
def list_test_simulations():
    """
    Render the page listing the test case simulations.
    """
    simulations = ['random', 'alternating', 'halves']

    context = {
        'simulations': simulations,
        'defaults': DEFAULTS,
    }
    return render_template('list_test_simulations.html', **context)


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
    filename = os.path.join(app.static_folder, 'json', simulation + '.json')
    with open(filename, 'r') as f:
        json_data = f.read()

    context = {
        'simulation': simulation,
        'num_generations': num_generations,
        'population_size': population_size,
        'has_stage': has_stage,
        'json_data': json_data,
    }

    return render_template('run_simulation.html', **context)


@app.route("/test-simulation/")
def run_test_simulation():
    """
    Run a test simulation.

    This is very similar to run_simulation, but instead of parsing
    a json file it creates a test table based on rules.
    """
    simulation = request.args['simulation']
    num_generations = int(request.args['num_generations'])
    population_size = int(request.args['population_size'])
    num_seats = int(request.args['num_seats'])

    context = {
        'simulation': simulation,
        'num_generations': num_generations,
        'population_size': population_size,
        'num_seats': num_seats,
    }

    return render_template('run_test_simulation.html', **context)
