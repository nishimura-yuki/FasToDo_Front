var gulp = require('gulp');
var ejs = require("gulp-ejs");
var fs = require("fs");
var rename = require("gulp-rename");
var config = require('../config').task.ejs;

gulp.task('ejs', function(){
    var json = JSON.parse(fs.readFileSync(config.config, "utf8"));
    gulp.src( config.src )
    .pipe(ejs(json))
    .pipe(rename({
        dirname: '',
        extname: '.html'
    }))
    .pipe(gulp.dest( config.dest ));
});
