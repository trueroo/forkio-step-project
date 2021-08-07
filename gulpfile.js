const { src, dest, parallel, series, watch } = require('gulp');

// const scss = require('gulp-sass')(require('sass')); // gulp-sass v5
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const jsminify = require('gulp-js-minify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const purgecss = require('gulp-purgecss');
const ttfToWoff = require('gulp-ttf2woff');
const ttfToWoff2 = require('gulp-ttf2woff2');
const fileinclude = require('gulp-file-include');

//INCLUDE не смог настроить, потом переделаю с ним
function file_include() {
  return src('./#src/html-include/index.html')
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(concat('index.html'))
    .pipe(dest('./#src/'));
}

// BROWSER-SYNC
function browserSyncFoo() {
  browserSync.init({
    server: {
      baseDir: './#src/',
    },
    browser: 'firefox',
    port: 8080,
    notify: false,
  });
}

// WATCHER
function watcher() {
  watch('./#src/scss/**/*.scss').on('change', series(clearCss, styles));
  watch('./#src/javascript/**/*.js').on('change', series(clearJs, scripts));
  watch('./#src/fonts/**/*').on('change', series(clearFonts, fonts));
  watch('./**/*.html').on('change', browserSync.reload);
}

// SCSS TO CSS
function styles() {
  return src('./#src/scss/**/*.scss')
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(concat('style.min.css'))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 3 versions'],
        grid: true,
      })
    )
    .pipe(
      purgecss({
        content: ['./#src/**/*.html', './#src/html-include/**/*.html'],
        safelist: {
          greedy: [/open$/],
        },
      })
    )
    .pipe(dest('./#src/css/'))
    .pipe(browserSync.stream());
}

// FONTS

function fonts1() {
  return src('./#src/myFonts/**/*').pipe(ttfToWoff()).pipe(dest('./#src/fonts/'));
}
function fonts2() {
  return src('./#src/myFonts/**/*').pipe(ttfToWoff2()).pipe(dest('./#src/fonts/'));
}
const fonts = parallel(fonts1, fonts2);

// JS
function scripts() {
  return src('./#src/javascript/**/*.js')
    .pipe(jsminify())
    .pipe(concat('script.min.js'))
    .pipe(dest('./#src/js/'))
    .pipe(browserSync.stream());
}

// IMAGEMIN
function images() {
  return src('./#src/images/**/*')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest('./#src/img'));
}

//CLEAR FOLDERS BEFORE TASKS
function clearCss() {
  return del('./#src/css');
}
function clearJs() {
  return del('./#src/js');
}
function clearImg() {
  return del('./#src/img');
}
function clearFonts() {
  return del('./#src/fonts');
}
const clearAll = parallel(clearCss, clearFonts, clearImg, clearJs);

// BUILD
function build() {
  return src(['./#src/*.html', './#src/fonts/**/*', './#src/css/**/*.css', './#src/js/**/*.js', './#src/images/**/*'], {
    base: './#src',
  }).pipe(dest('build'));
}

// DELETE BUILD
function clearBuild() {
  return del('build');
}

// exports
exports.browserSyncFoo = browserSyncFoo;
exports.watcher = watcher;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.clearBuild = clearBuild;
exports.build = build;
exports.clearCss = clearCss;
exports.clearJs = clearJs;
exports.clearImg = clearImg;
exports.fonts = fonts;
exports.fonts1 = fonts1;
exports.fonts2 = fonts2;
exports.clearFonts = clearFonts;
exports.clearAll = clearAll;
exports.file_include = file_include;

// DEV
exports.default = series(file_include, styles, scripts, images, fonts, parallel(browserSyncFoo, watcher));
// BUILD
exports.buildTask = series(clearBuild, build);
