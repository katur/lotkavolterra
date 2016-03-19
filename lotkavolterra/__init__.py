# See https://exploreflask.com/en/latest/configuration.html

from flask import Flask
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


from lotkavolterra import views
