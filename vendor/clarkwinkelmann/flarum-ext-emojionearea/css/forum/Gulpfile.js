/**
 * This file is part of clarkwinkelmann/flarum-ext-emojionearea
 * See README.md for details and license
 */

var gulp = require('gulp');

gulp.task('default', function() {
    gulp.src([
        'node_modules/emojionearea/dist/emojionearea.css'
    ]).pipe(gulp.dest('dist'));
});
