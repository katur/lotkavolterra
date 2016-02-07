from localsettings import DEBUG

from lotkavolterra.views import app


if __name__ == "__main__":
    app.run(debug=DEBUG)
