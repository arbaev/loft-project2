var gulp = require("gulp"),
    jade = require('gulp-jade'),
    prettify = require('gulp-prettify'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    gulpif = require('gulp-if'),
    filter = require('gulp-filter'),
    size = require('gulp-size'),
    imagemin = require('gulp-imagemin'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    gutil = require('gulp-util'),
    // ftp = require('vinyl-ftp'),
    reload = browserSync.reload;

// ====================================================
// ====================================================
// ============== Локальная разработка src ============

// Компилируем Jade в html
gulp.task('jade', function() {
    gulp.src('src/templates/pages/*.jade')
    .pipe(jade({
        pretty: true
      }))
    .on('error', log)
    .pipe(gulp.dest('src/'))
    .pipe(reload({stream: true}));
});

// Запускаем локальный сервер (только после компиляции jade)
gulp.task('server', ['jade'], function () {
  browserSync({
    notify: true,
    port: 9000,
    server: {
      baseDir: 'src'
    }
  });
});

// Подключаем ссылки на bower
gulp.task('wiredep', function () {
  gulp.src('src/templates/common/*.jade')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('src/templates/common/'))
});

// слежка и запуск задач
gulp.task('watch', function () {
  gulp.watch('src/templates/**/*.jade', ['jade']);
  gulp.watch('bower.json', ['wiredep']);
  gulp.watch([
    'src/js/**/*.js',
    'src/css/**/*.css'
  ]).on('change', reload);
});

// Задача по-умолчанию
gulp.task('default', ['server', 'watch']);


// ====================================================
// ====================================================
// ===================== Функции ======================

// Более наглядный вывод ошибок
var log = function (error) {
  console.log([
    '',
    "----------ERROR MESSAGE START----------",
    ("[" + error.name + " in " + error.plugin + "]"),
    error.message,
    "----------ERROR MESSAGE END----------",
    ''
  ].join('\n'));
  this.end();
}

// ====================================================
// ====================================================
// =============== Важные моменты  ====================
// gulp.task(name, deps, fn)
// deps - массив задач, которые будут выполнены ДО запуска задачи name
// внимательно следите за порядком выполнения задач!


// ====================================================
// ====================================================
// ================= Сборка DIST ======================

// Очистка папки
gulp.task('clean', function () {
  return gulp.src('dist')
    .pipe(clean());
});

// Переносим HTML, CSS, JS в папку dist
gulp.task('useref', function () {
  var assets = useref.assets();
  return gulp.src('src/*.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

// Перенос шрифтов
gulp.task('fonts', function() {
  gulp.src('src/fonts/*')
    .pipe(filter(['*.eot','*.svg','*.ttf','*.woff','*.woff2']))
    .pipe(gulp.dest('dist/fonts/'))
});

// Картинки
gulp.task('images', function () {
  return gulp.src('src/img/**/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/img'));
});

// Остальные файлы, такие как favicon.ico и пр.
gulp.task('extras', function () {
  return gulp.src([
    'src/*.*',
    '!src/*.html'
  ]).pipe(gulp.dest('dist'));
});

// Сборка и вывод размера содержимого папки dist
gulp.task('dist', ['useref', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe(size({title: 'build'}));
});

// Собираем папку DIST (только после компиляции Jade)
gulp.task('build', ['clean', 'jade'], function () {
  gulp.start('dist');
});

// Проверка сборки
gulp.task('server-dist', function () {
  browserSync({
    notify: false,
    port: 8000,
    server: {
      baseDir: 'dist'
    }
  });
});


// ====================================================
// ====================================================
// ===== Отправка проекта на сервер ===================

gulp.task( 'deploy', function() {

  var conn = ftp.create( {
      host:     'testtest.kovalchuk.us',
      user:     'kovaldn_test',
      password: 'test',
      parallel: 10,
      log: gutil.log
  } );

  var globs = [
      'dist/**/*'
  ];

  return gulp.src(globs, { base: 'dist/', buffer: false })
    .pipe(conn.dest( 'public_html/'));

});