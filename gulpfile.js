"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgmin = require('gulp-svgmin');
const svgstore = require("gulp-svgstore");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const del = require("del");
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const server = require("browser-sync").create();

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

const css = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      require('webp-in-css/plugin'),
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
}

exports.css = css;

const js = () => {
  return gulp.src("source/js/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
}

exports.js = js;

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

const webpi = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 85}))
    .pipe(gulp.dest("build/img"))
}

exports.webp = webp;

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

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
}

exports.copy = copy;

const clean = () => {
  return del("build");
}

exports.clean = clean;

const refresh = (done) => {
  server.reload();
  done();
}

exports.refresh = refresh;

const watch = () => {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/js/**/*.js", gulp.series(js, refresh));
  gulp.watch("source/sass/**/*.scss", gulp.series(css));
  gulp.watch("source/img/icon-*.svg", gulp.series(sprite, html, refresh));
  gulp.watch("source/*.html", gulp.series(html, refresh));
}

exports.watch = watch;

exports.build = gulp.series(clean, gulp.parallel(images, webpi, sprite, copy, js, css, html));
exports.start = gulp.series(exports.build, watch);
exports.dev = gulp.series(watch);
