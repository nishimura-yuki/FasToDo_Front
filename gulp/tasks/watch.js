var gulp = require('gulp');
var config = require('../config').task.watch;

gulp.task('watch', function () {

    console.log(config);

    // webpack
    gulp.watch(config.webpack,
        ['webpack']
    );

    // copy
    gulp.watch(config.html,
        ['copy']
    );

    // img
    gulp.watch(config.img, 
        ['imagemin']
    );

    //ejs
    gulp.watch(config.ejs, 
        ['ejs']
    );

});
