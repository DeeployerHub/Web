'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('default', ['sass', 'css-copy']);

gulp.task('css-copy', function () {
    var copyList = ['css', 'images', 'js', 'fonts'];

    for (var i in copyList) {
        gulp.src('./assets/' + copyList[i] + '/**', {base: './assets/' + copyList[i]})
            .pipe(gulp.dest('./public/assets/' + copyList[i] + '/'));
    }
});
gulp.task('sass', function () {
    return gulp.src('./assets/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass', 'css-copy']);
});