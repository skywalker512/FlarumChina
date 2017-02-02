var gulp = require('flarum-gulp');

gulp({
  modules: {
    'avatar4eg/users-list': [
      '../lib/**/*.js',
      'src/**/*.js'
    ]
  }
});
