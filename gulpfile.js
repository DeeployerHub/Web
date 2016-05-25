var del = require('del');
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
    public: [
        'sass',
        'css',
        'images',
        'js',
        'fonts'
    ]
};

gulp.task('default', ['assets', 'bower-assets', 'node-assets']);

gulp.task('assets-cleanup', function () {
    'use strict';

    return del(dir.assets.dest, {
        dryRun: true,
        force: true
    });
});

gulp.task('bower-assets', function () {
    'use strict';

    gulp.src(dir.assets.bower + '/**', {base: dir.assets.bower})
        .pipe(gulp.dest(dir.assets.dest + '/bower'));
});

gulp.task('node-assets', function () {
    'use strict';

    [
        'io.io-client'
    ].forEach(function (item) {
        gulp.src(dir.assets.node + '/' + item + '/**', {base: dir.assets.node + '/' + item})
            .pipe(gulp.dest(dir.assets.dest + '/node/' + item + '/'));
    });
});

gulp.task('assets', ['assets-cleanup'], function () {
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

gulp.task('watch', function () {
    'use strict';

    gulp.watch(dir.assets.source + '/**', ['assets', 'bower-assets', 'node-assets']);
});
