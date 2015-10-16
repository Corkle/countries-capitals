var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'add-stream'],
    replaceString: /\bgulp[\-.]/
});

var paths = {
    style: 'assets/css/style.css',
    scripts: ['app/**/*.js'],
    ngscriptPath: 'assets/js/',
    ngscriptName: 'combined-scripts.js',
    index: './index.html',
    partials: 'app/**/*.html',
    build: 'build/'
};

// concatenate all AngularJS files
gulp.task('bundle-scripts', ['clean-scripts'],function () {
        return gulp.src(paths.scripts)
        .pipe(plugins.addStream.obj(partialsToTemplates()))
        .pipe(plugins.concat(paths.ngscriptName))        
        .pipe(gulp.dest(paths.ngscriptPath))
        .pipe(plugins.connect.reload());
});

function partialsToTemplates() {
    return gulp.src(paths.partials)
    .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(plugins.angularTemplatecache({standalone: true}));
}

gulp.task('html', function() {
    gulp.src(paths.index)
    .pipe(plugins.connect.reload());
});

gulp.task('usemin', ['bundle-scripts'],function () {
    gulp.src(paths.index)
        .pipe(plugins.usemin({
            css: ['concat', plugins.purifycss(paths.scripts.concat(paths.index, paths.partials), {
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

gulp.task('clean-scripts', function() {
    gulp.src(paths.ngscriptPath + paths.ngscriptName)
        .pipe(plugins.clean());
});

gulp.task('build', ['bundle-scripts', 'usemin']);

gulp.task('default', ['bundle-scripts', 'connectDev'], function() {
    plugins.watch(paths.partials, function() {gulp.start(['bundle-scripts']);});
    plugins.watch(paths.scripts, function() {gulp.start(['bundle-scripts']);});
    gulp.watch(paths.index, ['html']);
    gulp.watch(paths.style, ['html']);
});

gulp.task('connectDev',['bundle-scripts'], function() {
   plugins.connect.server({
       root: [__dirname],
       port: 8000,
       livereload: true
   }); 
});

gulp.task('connectDist', function() {
    plugins.connect.server({
        root: ['build'],
        port: 8080
    }); 
});