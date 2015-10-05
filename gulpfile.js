var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'add-stream'],
    replaceString: /\bgulp[\-.]/
});

var paths = {
    scripts: ['app/app.module.js', 'app/shared/**/*.js', 'app/components/**/*.js'],
    ngscriptPath: 'assets/js/',
    ngscriptName: 'combined-scripts.js',
    index: './index.html',
    partials: 'app/**/*.html',
    build: 'build/'
};

// concatenate all AngularJS files
gulp.task('bundle-scripts', function () {
    gulp.src(paths.scripts)
        .pipe(plugins.addStream.obj(partialsToTemplates()))
        .pipe(plugins.concat(paths.ngscriptName))        
        .pipe(gulp.dest(paths.ngscriptPath));
});

function partialsToTemplates() {
    return gulp.src(paths.partials)
    .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(plugins.angularTemplatecache());
}

gulp.task('usemin', function () {
    gulp.src(paths.index)
        .pipe(plugins.usemin({
            css: ['concat', plugins.purifycss(paths.scripts.concat(paths.index), {
                info: true,
                rejected: true
            }), plugins.autoprefixer('last 2 versions'), plugins.minifyCss({
                keepSpecialComments: 0
            })],
            vendor: ['concat', plugins.stripDebug(), plugins.uglify()],
            js: ['concat', plugins.stripDebug(), plugins.uglify()]
        }))
        .pipe(gulp.dest(paths.build));
});

gulp.task('clean', function () {
    gulp.src([paths.build, paths.ngscriptPath + paths.ngscriptName], {
            read: false
        })
        .pipe(plugins.clean());
});

gulp.task('build', ['bundle-scripts', 'usemin']);

gulp.task('default', ['bundle-scripts'], function() {
    gulp.watch(paths.partials, ['bundle-scripts']);
    gulp.watch(paths.scripts, ['bundle-scripts']);
});