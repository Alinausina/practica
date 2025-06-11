const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const fileInclude = require('gulp-file-include');
const {src, dest, watch, series, parallel} = gulp;

const paths = {
    html: {
        src: 'src/html/*.html',
        dest: 'dist/',
        watch: 'src/html/**/*.html'
    },
    scss: {
        src: 'src/scss/style.scss',
        dest: 'dist/css/',
        watch: 'src/scss/**/*.scss'
    },
}



function html() {
    return src(paths.html.src)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest(paths.html.dest))
        .pipe(browserSync.stream());
}

function styles() {
    return src(paths.scss.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({level: 2}))
        .pipe(dest(paths.scss.dest))
        .pipe(browserSync.stream());
}

function serve() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        },
        notify: false
    });

    watch(paths.scss.watch, styles);
    watch(paths.html.watch, html);
}


exports.default = series(
    parallel(html, styles),
    serve
);
