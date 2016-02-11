var gulp = require('flarum-gulp');

gulp({
    modules: {
        'flagrow/image-upload': [
            'src/**/*.js'
        ]
    }
});