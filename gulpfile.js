'use strict';
var gulp = require('gulp');
var sprite = require('./');

gulp.task('default', function () {
    return gulp.src(['./fixture/*.svg'])
        .pipe(sprite({
            svg: 'my-sprites.svg',
            json: 'my-sprites.json'
        }))
        .pipe(gulp.dest('./dest'));
});