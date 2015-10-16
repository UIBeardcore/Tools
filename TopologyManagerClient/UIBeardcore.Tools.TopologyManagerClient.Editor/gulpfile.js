/// <binding BeforeBuild='stylus' />
var gulp = require('gulp'),
    stylus = require('gulp-stylus');

// Stylus
gulp.task('stylus', function () {
	return gulp.src('Views/Popups/*.styl')
        .pipe(stylus())
		.pipe(gulp.dest('Views/Popups'))
		.on('error', console.log);
});

gulp.task('watch', function () {
	return gulp.watch('Views/Popups/*.styl', ['stylus']).on('error', console.log);
});