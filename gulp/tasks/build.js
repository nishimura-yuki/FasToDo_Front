var gulp = require('gulp');
gulp.task('build', ['webpack', 'ejs', 'copy', 'imagemin']);
