var gulp = require('gulp');
var watch = require("gulp-watch");
var config = require('../config').task.watch;

gulp.task('watch', function () {

    console.log(config);

    // webpack
    gulp.watch(config.webpack,
        ['webpack']
    );
   /*
    watch(config.webpack, function () {
        gulp.task("webpack");
    });
   */ 
    // copy
    gulp.watch(config.ejs,
        ['copy']
    );
   /*
    watch(config.ejs, function () {
        gulp.task("copy");
    });
    */
 
/*
    // img
    gulp.watch(config.img, 
        ['imagemin']
    );

    //ejs
    gulp.watch(config.ejs, 
        ['ejs']
    );
*/
});
