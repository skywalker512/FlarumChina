var gulp = require('flarum-gulp');

gulp({
    modules: {
        'Reflar/gamification': [
            '../lib/**/*.js',
            'src/**/*.js'
        ]
    }
});