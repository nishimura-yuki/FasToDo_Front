var gulp = require('gulp');
var config = require('../config').task.copy;

gulp.task('copy', function () {
    gulp.src(config.src)
        .pipe(gulp.dest(config.dest));
});
