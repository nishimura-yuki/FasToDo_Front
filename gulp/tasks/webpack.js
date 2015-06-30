var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var webpack = require('gulp-webpack');
var config = require('../config');
var appConfig = config.config;
var webpackConfig = config.task.webpack;

gulp.task('webpack', function () {
    gulp.src('')
        .pipe(webpack(webpackConfig))
        .pipe(gulpif(appConfig.js.uglify, uglify()))
        .pipe(gulp.dest(appConfig.js.dest));
});
