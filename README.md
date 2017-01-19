# gulp-svg-symbol-sprite
Generate sprites symbols from svgs by cleaning them up with svgo and concatenating them. 

## Usage:

```js
gulp.task('svg', function () {
    return gulp.src(['fixture/*.svg'])
        .pipe(sprite('my-sprites.svg'))
        .pipe(gulp.dest('dest'));
});
```
