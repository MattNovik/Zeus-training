var gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'),
    cssnano = require("gulp-cssnano"), // Минимизация CSS
    autoprefixer = require('gulp-autoprefixer'), // Проставлет вендорные префиксы в CSS для поддержки старых браузеров
    imagemin = require('gulp-imagemin'), // Сжатие изображений
    concat = require("gulp-concat"), // Объединение файлов - конкатенация
    uglify = require("gulp-uglify"), // Минимизация javascript
    rename = require("gulp-rename") // Переименование файлов
    browserSync = require('browser-sync');// Создаю сервер на браузере

gulp.task("html", function() {
    return gulp.src("app/*.html")
    .pipe(gulp.dest("prod"));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'prod'
    },
    port: 8080,
    open: true,
    notify: false
  });
  gulp.watch("prod/*.html").on('change', browserSync.reload);
  gulp.watch("prod/css/*.css").on('change', browserSync.reload);
  gulp.watch("prod/images/*.+(jpg|jpeg|png|gif|svg)").on('change', browserSync.reload);
  gulp.watch("prod/script/*.js").on('change', browserSync.reload);
});


gulp.task('sass', function() { // Создаем таск "sass"
  return gulp.src(['app/scss/**/*.scss']) // Берем источник
    .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(autoprefixer({
       browsers: ['last 2 versions'],
       cascade: false
     }))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('prod/css')) // Выгружаем результата в папку css
    .pipe(browserSync.stream());
  });

gulp.task("scripts", function() {
    return gulp.src("app/script/*.js") // директория откуда брать исходники
        .pipe(concat('scripts.js')) // объеденим все js-файлы в один 
        .pipe(uglify()) // вызов плагина uglify - сжатие кода
        .pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
        .pipe(gulp.dest("prod/script")); // директория продакшена, т.е. куда сложить готовый файл
});

gulp.task('imgs', function() {
    return gulp.src("app/images/**/*.+(jpg|jpeg|png|gif|svg)")
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest("prod/images"))
});

gulp.task('watch', function() {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch("app/*.html", gulp.parallel('html'));
    gulp.watch("app/script/*.js", gulp.parallel('scripts'));
    gulp.watch("app/images/*.+(jpg|jpeg|png|gif|svg)", gulp.parallel('imgs'));
});

gulp.task("default", gulp.parallel("html", "sass", "scripts", "imgs","browserSync", "watch"));