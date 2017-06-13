var gulp = require('flarum-gulp');

gulp({
    modules: {
        'flagrow/masquerade': [
            '../lib/**/*.js',
            'src/**/*.js'
        ]
    }
});
