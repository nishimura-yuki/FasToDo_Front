var gulp = require('gulp');
var webserver = require('gulp-webserver');
var config = require('../config').config;

gulp.task('webserver',function(){
    gulp.src(config.dest)
        .pipe(webserver({
            host: "192.168.33.10" ,
            livereload: true,
            port: 2000,
            fallback: 'index.html',
            open: true,
            https: false 
        }));
});
