var gulp = require('flarum-gulp');

gulp({
    modules: {
        'flagrow/split': [
            'src/**/*.js'
        ]
    }
});
