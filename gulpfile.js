var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

var dest = 'build/';

// concatenate and minify all js files
gulp.task('js', function () {
    var jsFiles = ['assets/js/*'];

    gulp.src(plugins.mainBowerFiles().concat(jsFiles))
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest + 'js'));
});

gulp.task('css', function () {
    var cssFiles = ['assets/css/*'];

    gulp.src(plugins.mainBowerFiles().concat(cssFiles))
        .pipe(plugins.filter('*.css'))
        .pipe(plugins.order([
        'boostrap.css',
        '*'
    ]))
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.autoprefixer('last 2 versions'))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(dest + 'css'));
});