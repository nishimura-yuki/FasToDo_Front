
var gulp = require('gulp');
var clean = require('gulp-clean');
var config = require('../config').config;

gulp.task('clean-dist', function () {
    gulp.src([
        config.dest + '/{,**/}*.html', // 対象ファイル
        config.dest + '/stylesheets',
        config.dest + '/javascripts',
        config.dest + '/images'
    ], {read: false} )
    .pipe(clean());
});

