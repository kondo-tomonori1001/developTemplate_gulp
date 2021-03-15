const gulp = require('gulp');
const plumber = require('gulp-plumber');

// ファイルのクリーンアップ
const del = require('del');
function clean(done){
  const distFiles = './dist/**/*';
  del(distFiles);
  done();
}

//html,incファイルのコピー
function copy(){
  return(
    gulp
      .src('src/**/*.+(inc|html)')
      .pipe(gulp.dest('./dist'))
  )
}
exports.copy = copy;

// icomoonコピー
// function copyIcomoon(){
//   return(
//     gulp
//       .src('src/international-delegates/common/sass/foundation/vendor/fonts/fonts/*')
//       .pipe(gulp.dest('./dist/international-delegates/common/styles/fonts'))
//   )
// }
// exports.copyIcomoon = copyIcomoon;

//sassのコンパイル
const sass = require('gulp-sass');
sass.compiler = require("dart-sass");
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

function sassCompile(){
  return (
    gulp
      .src('src/common/sass/main.scss')
      .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(sass({outputStyle: 'expanded'}))
      .pipe(
        postcss([
        autoprefixer({
          cascade:false,
          grid:true
          })
        ])
      )
      .pipe(rename('style.css'))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('./dist/common/styles'))
  );
}
exports.sassCompile = sassCompile;

// ビルド用（sourcemapを生成しない）
function sassCompileBuild(){
  return (
    gulp
      .src('src/common/sass/main.scss')
      .pipe(plumber())
      .pipe(sass({outputStyle: 'expanded'}))
      .pipe(
        postcss([
        autoprefixer({
          cascade:false,
          grid:true
          })
        ])
      )
      .pipe(rename('style.css'))
      .pipe(gulp.dest('./dist/common/styles'))
  );
}
exports.sassCompile = sassCompileBuild;

//CSS圧縮
function cssMinimum(){
  return(
    gulp
      .src('dist/common/styles/style.css')
      .pipe(cleancss())
      .pipe(rename({
        extname:'.min.css'
      }))
      .pipe(gulp.dest('./dist/common/styles'))
  );
}
exports.cssMinimum = cssMinimum;

//browserSync
const browserSync = require('browser-sync').create(); 
const connectSSI = require('connect-ssi');

function browserSyncFunc(){
  return(
    browserSync.init({
      server: {
        baseDir: 'dist',
        middleware: [
          connectSSI({
            ext: '.html',
            baseDir: 'dist',
          })
        ]
      },
      open: 'external',
      startPath: './',
      online: true,
      reloadOnRestart: true,
    })
  )
}
exports.browserSyncFunc = browserSyncFunc;

// browserSync Reload
function reload(done){
  browserSync.reload();
  done();
}
exports.reload = reload;

// imagemin
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const gulpCleanCss = require('gulp-clean-css');

function images(){
  return(
    gulp
      .src(['src/**/*.+(jpg|jpeg|png|svg)','!src/**/fonts/*.svg'])
      .pipe(imagemin([
        mozjpeg(),
        pngquant(),
        imagemin.svgo(),
      ]))
      .pipe(gulp.dest('./dist/'))
  )
}
exports.images = images;

// JSConcat
const concat = require('gulp-concat');
const { series } = require('gulp');
// main.js
function mainConcat(){
  return(
    gulp
      .src([
        'src/common/scripts/main.js',
      ])
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./dist/common/scripts'))
  )
}
exports.mainConcat = mainConcat;

// vendor.js
function vendorConcat(){
  return(
    gulp
      .src([
        'src/common/scripts/vendor/jquery-3.5.1.min.js',
      ])
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('./dist/common/scripts'))
  )
}
exports.vendorConcat = vendorConcat;


//watch
function watch(){
  gulp.watch('src/common/sass',gulp.series('sassCompile','cssMinimum'));
  gulp.watch('src/common/scripts',gulp.series('mainConcat','reload'));
  gulp.watch('src/**/*.+(jpg|jpeg|png|svg)',gulp.series('images','reload'));
  gulp.watch('src/**/*.+(inc|html|ico|json)',gulp.series('copy','reload'));
  gulp.watch('./**/*.css',reload);
  gulp.watch('./**/*.js',reload);
}

exports.default = gulp.series(gulp.series(copy,sassCompile,images,mainConcat,vendorConcat),gulp.parallel(browserSyncFunc,watch));
exports.clean=clean;
exports.build = gulp.series(clean,copy,sassCompileBuild,cssMinimum,images,mainConcat,vendorConcat);

