var gulp = require('gulp');
var util = require('gulp-util');
var plumber = require('gulp-plumber');
var sass = require('gulp-ruby-sass');

var sassFiles = '**/*.sass';
var sassMain = 'static/stylesheets/styles.sass';
var cssDir = 'static/stylesheets/';

gulp.task('default', function() {
  gulp.run('compileSass')
  gulp.watch(sassFiles, ['compileSass']);
});

gulp.task('compileSass', function() {
  return sass(sassMain)
    .on('error', sass.logError)
    .pipe(gulp.dest(cssDir));
});
