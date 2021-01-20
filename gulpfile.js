const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
const svgmin = require('gulp-svgmin');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const del = require("del");
const htmlmin = require('gulp-htmlmin');

const js = () => {
  return gulp.src("source/js/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
}

exports.js = js;

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

const clean = () => {
  return del("build");
}

exports.clean = clean;

const images = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({quality: 90, progressive: true}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.images = images;

const sprite = () => {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgmin(function (file) {
      return {
        plugins: [{
          cleanupIDs: {
            prefix: 'icon-',
            minify: true
          }
        }]
      }
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

const webpi = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 85}))
    .pipe(gulp.dest("build/img"))
}

exports.webp = webp;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

const refresh = (done) => {
  server.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/**/*.js", gulp.series(js, refresh));
  gulp.watch("source/img/icon-*.svg", gulp.series(sprite, refresh));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.build = gulp.series(clean, gulp.parallel(images, webpi, sprite, js, styles, html));
exports.start = gulp.series(exports.build, server, watcher);
exports.default = gulp.series(exports.start);
