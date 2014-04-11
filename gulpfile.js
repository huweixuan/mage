var gulp = require('gulp');

var imagemin = require('gulp-imagemin');
var less = require('gulp-less');

// Copy all static images
gulp.task('imagemin', function() {
  return gulp.src('less/img/*')
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('css/img'))
});

gulp.task('less', function () {
  return gulp.src('less/style.less')
    .pipe(less())
    .pipe(gulp.dest('css'));
});

gulp.task('font', function () {
  return gulp.src('less/chalk.ttf')
    .pipe(gulp.dest('css'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['less', 'imagemin', 'font']);