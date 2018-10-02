var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');

var configureSetup  = {
    createModule: false
};

gulp.task('default', function() {
  gulp.src('config.json')
      .pipe(gulpNgConfig('app', configureSetup))
      .pipe(gulp.dest('app'));
});
