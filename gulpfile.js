var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    livereload = require('gulp-livereload'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass');

gulp.task('main', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('public'))
        .on('error', console.error.bind(console))
        .pipe(livereload());
})

gulp.task('scripts', function () {
    gulp.src('src/js/**.js')
        .pipe(browserify())
        .on('error', console.error.bind(console))
        // .pipe(uglify())
        .on('error', console.error.bind(console))
        .pipe(gulp.dest('public/scripts'))
        .pipe(livereload());
});

gulp.task('styles', function () {
    gulp.src('src/scss/**.scss')
        .pipe(sass({
            style: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest('public/styles'))
        .pipe(livereload());
});

gulp.task('assets', function () {
    gulp.src('src/assets/**')
        .pipe(imagemin({
            progressive: true
        }))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest('public/assets'))
        .pipe(livereload());
})

gulp.task('watch', function () {
    gulp.watch('src/index.html', ['main']);
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/assets/**/*', ['assets']);
    var server = livereload({start: true});
});

gulp.task('default', ['main', 'scripts', 'styles', 'assets', 'watch']);