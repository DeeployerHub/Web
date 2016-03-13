const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const dir = {
    assets: {
        source: './assets',
        dest: './public/assets',
        bower: './bower_components',
        node: './node_modules'
    }
};

const assets = {
    public: [
        'sass',
        'css',
        'images',
        'js',
        'fonts'
    ]
};

gulp.task('default', ['assets', 'bower-assets']);

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

gulp.task('assets:watch', function () {
    'use strict';

    gulp.watch(dir.assets.source + '/**', ['assets', 'bower-assets']);
    gulp.watch(dir.assets.bower + '/**', ['assets', 'bower-assets']);
});
