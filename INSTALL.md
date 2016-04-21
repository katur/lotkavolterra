# Installing the lotkavolterra Project


## Get the code

```
git clone https://github.com/katur/lotkavolterra.git
```


## Install the dependencies

Webpack is used for bundling Javascripts.
Also, CSS is in [SASS](http://sass-lang.com/), so needs to be compiled.
There is a [Gulp.js build script](gulpfile.js) to accomplish both tasks
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
