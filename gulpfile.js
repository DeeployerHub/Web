var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var dir = {
    assets: {
        source: './assets',
        dest: './public/assets',
        bower: './bower_components',
        node: './node_modules'
    }
};

var assets = {
    node: [
        'angular2',
        'es6-promise',
        'es6-shim',
        'reflect-metadata',
        'rxjs',
        'zone.js'
    ],
    public: [
        'sass',
        'css',
        'images',
        'js',
        'fonts'
    ]
};

gulp.task('default', ['assets', 'bower-assets', 'node-assets']);

gulp.task('node-assets', function () {
    'use strict';

    assets.node.forEach(function (item) {
        gulp.src(dir.assets.node + '/' + item + '/**', {base: dir.assets.node})
            .pipe(gulp.dest(dir.assets.dest + '/node'));
    });
});
gulp.task('bower-assets', function () {
    'use strict';

    gulp.src(dir.assets.bower + '/**', {base: dir.assets.bower})
        .pipe(gulp.dest(dir.assets.dest + '/bower'));
});

gulp.task('assets', function () {
    'use strict';

    assets.public.forEach(function (item) {
        gulp.src(dir.assets.source + '/' + item + '/**', {base: dir.assets.source + '/' + item})
            .pipe(gulp.dest(dir.assets.dest + '/' + item + '/'));
    });

    gulp.src(dir.assets.source + '/sass/**')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dir.assets.dest + '/css'));
});

gulp.task('assets:watch', function () {
    'use strict';

    gulp.watch(dir.assets.source + '/**', ['assets', 'bower-assets']);
    gulp.watch(dir.assets.bower + '/**', ['assets', 'bower-assets']);
});
