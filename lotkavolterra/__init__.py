from flask import Flask, render_template, request


DEFAULTS = {
    'num_generations': 50,
    'num_seats': 10,  # This one used for test case simulations only
}

TEST_SIMULATIONS = ['random', 'alternating', 'halves']


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
    context = {
        'input_simulations': app.config['INPUT_SIMULATIONS'],
        'test_simulations': TEST_SIMULATIONS,
        'defaults': DEFAULTS,
    }
    return render_template('home.html', **context)


@app.route("/run-simulation/")
def run_simulation():
    """
    Run the simulation from an input file.
    """
    simulation = request.args['simulation']

    context = {
        'simulation': simulation,
        'num_generations': int(request.args['num_generations']),
        'repeat': 'repeat' in request.args,
        'is_test': simulation in TEST_SIMULATIONS,
    }

    if context['is_test']:
        context['num_seats'] = int(request.args['num_seats'])

    return render_template('run_simulation.html', **context)
