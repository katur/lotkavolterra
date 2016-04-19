# Installing the lotkavolterra Project


## Get the code

```
git clone https://github.com/katur/lotkavolterra.git
```


## Install the dependencies

Python version is listed in [runtime.txt](runtime.txt).

Python package dependencies are listed in
[requirements.txt](requirements.txt).
These should be [pip](https://pypi.python.org/pypi/pip)-install into a fresh
[Python virtual environment](http://virtualenv.readthedocs.org/).

CSS is in [SASS](http://sass-lang.com/) so needs to be compiled to CSS.
Also, webpack is used for bundling Javascripts.
There is a [Gulp.js build script](gulpfile.js) to accomplish both things
in development.
To set up, assuming [Gulp.js](http://gulpjs.com/) is installed on the system,
run the following in the project root (which will install the
<package.json> dependencies in a git-ignored directory called `node_modules`):
```
npm install
```

To start the gulp build script, run the following in the project root:
```
gulp
```
