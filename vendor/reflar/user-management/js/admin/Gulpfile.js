var gulp = require('flarum-gulp');

gulp({
    modules: {
        'Reflar/UserManagement': [
            'src/**/*.js'
        ]
    }
});
