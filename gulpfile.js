'use strict';
var gulp = require('gulp');
var sprite = require('./');

gulp.task('default', function () {
    return gulp.src(['fixture/*.svg'])
        .pipe(sprite('my-sprites.svg'))
        .pipe(gulp.dest('dest'));
});