var flarum = require('flarum-gulp');

flarum({
    files: [
        'bower_components/pagedown-flarum/dist/Markdown.Editor.min.js',
    ],
    modules: {
        'xengine/mdeditor': [
            'src/**/*.js'
        ]
    }
});