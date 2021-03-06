# Installing the lotkavolterra Project


## Get the code

```
git clone https://github.com/katur/lotkavolterra.git
```


## Install development dependencies

[Webpack](http://webpack.github.io) is used for bundling Javascripts.
Also, CSS is in [SASS](http://sass-lang.com/), so needs to be compiled.
There is a [Gulp.js build script](gulpfile.js) to accomplish both tasks
in development.

To set up
(assuming [Gulp.js](http://gulpjs.com/) and the SASS Ruby gem
are installed on the system),
first run the following in the project root to install
the <package.json> dependencies in a git-ignored directory
called `node_modules`:
```
npm install
```

To start the gulp build script during development, run the following
in the project root:
```
gulp
```


## Run development server

Python comes with a free dev server:
```
python -m SimpleHTTPServer
```
