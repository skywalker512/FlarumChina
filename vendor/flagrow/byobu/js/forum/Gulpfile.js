var gulp = require('flarum-gulp');

gulp({
    modules: {
        'flagrow/byobu': [
            '../lib/**/*.js',
            'src/**/*.js'
        ]
    }
});
