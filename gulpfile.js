'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var dir = {
    assets: {
        source: './assets',
        dest: './public/assets',
        bower: './bower_components'
    },
}


gulp.task('default', ['assets', 'bower-assets']);

gulp.task('bower-assets', function () {
    var copyList = [
        'jquery',
        'bootstrap',
        'owl.carousel',
        'jquery.easing',
    ];

    for (var i in copyList) {
        gulp.src(dir.assets.bower + '/' + copyList[i] + '/**', {base: dir.assets.bower + '/' + copyList[i]})
            .pipe(gulp.dest(dir.assets.dest + '/bower/' + copyList[i] + '/'));
    }

});

gulp.task('assets', function () {
    var copyList = ['sass', 'css', 'images', 'js', 'fonts'];

    for (var i in copyList) {
        gulp.src(dir.assets.source + '/' + copyList[i] + '/**', {base: dir.assets.source + '/' + copyList[i]})
            .pipe(gulp.dest(dir.assets.dest + '/' + copyList[i] + '/'));
    }

    gulp.src(dir.assets.source + '/sass/**')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dir.assets.dest + '/css'))
});

gulp.task('assets:watch', function () {
    gulp.watch(dir.assets.source + '/**', ['assets', 'bower-assets']);
    gulp.watch(dir.assets.bower + '/**', ['assets', 'bower-assets']);
});