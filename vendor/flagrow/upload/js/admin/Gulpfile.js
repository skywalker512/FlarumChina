var gulp = require('flarum-gulp');

gulp({
    modules: {
        'flagrow/upload': [
            'src/**/*.js'
        ]
    }
});