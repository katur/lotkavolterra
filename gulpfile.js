var gulp = require("gulp");
var gutil = require("gulp-util");
var sass = require("gulp-ruby-sass");
var webpack = require("webpack");

var cssDir = "./lotkavolterra/static/stylesheets/";
var sassMain = cssDir + "styles.sass";
var sassFiles = cssDir + "**/*";

var jsDir = "./lotkavolterra/static/js/";
var jsMain = jsDir + "app.js";
var jsFiles = jsDir + "**/*";

var webpackConfig = {
  entry: jsMain,
  output: {
    path: jsDir,
    filename: "app.bundle.js"
  }
};

gulp.task("default", function() {
  gulp.start("compileCSS");
  gulp.start("compileJS");
  gulp.watch(sassFiles, ["compileCSS"]);
  gulp.watch(jsFiles, ["compileJS"]);
});

gulp.task("compileCSS", function() {
  return sass(sassMain)
    .on("error", sass.logError)
    .pipe(gulp.dest(cssDir));
});

gulp.task("compileJS", function(callback) {
  webpack(webpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // webpack compilation display options
    }));
    callback();
  });
});
