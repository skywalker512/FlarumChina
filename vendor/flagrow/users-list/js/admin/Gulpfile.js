var gulp = require('flarum-gulp');

gulp({
  modules: {
    'flagrow/users-list': [
      '../lib/**/*.js',
      'src/**/*.js'
    ]
  }
});
