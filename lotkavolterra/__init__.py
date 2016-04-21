from flask import Flask, render_template, request


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


@app.route("/run-simulation/")
def run_simulation():
    """
    Run the simulation from an input file.
    """
    simulation = request.args['simulation']
    is_test = request.args['type'] == 'test-based'

    try:
        num_generations = int(request.args['num_generations'])
    except Exception:
        num_generations = 50

    try:
        num_seats = int(request.args['num_seats'])
    except Exception:
        num_seats = 10

    context = {
        'simulation': simulation,
        'is_test': is_test,
        'num_generations': num_generations,
        'num_seats': num_seats,
        'repeat': 'repeat' in request.args,
    }

    return render_template('run_simulation.html', **context)
