/**
 * This file is part of clarkwinkelmann/flarum-ext-emojionearea
 * See README.md for details and license
 */

var flarum = require('flarum-gulp');

flarum({
    files: [
        'node_modules/emojionearea/dist/emojionearea.js'
    ],
    modules: {
        'clarkwinkelmann/emojionearea': [
            'src/**/*.js'
        ]
    }
});
