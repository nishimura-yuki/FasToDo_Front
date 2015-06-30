var gulp     = require('gulp');
var imagemin = require('gulp-imagemin');
var config = require('../config').task.imagemin;

gulp.task( 'imagemin', function(){
    var imageminOptions = {
        optimizationLevel: 7
    };

    gulp.src( config.src )
        .pipe(imagemin( imageminOptions ))
        .pipe(gulp.dest( config.dest ));
});
