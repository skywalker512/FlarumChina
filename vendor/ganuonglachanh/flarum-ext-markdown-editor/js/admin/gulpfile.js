var flarum = require('flarum-gulp');

flarum({
    modules: {
        'ganuonglachanh/mdeditor': [
            'src/**/*.js'
        ]
    }
});
