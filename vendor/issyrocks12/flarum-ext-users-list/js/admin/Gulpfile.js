var gulp = require('flarum-gulp');

gulp({
  modules: {
    'issyrocks12/users-list': [
      '../lib/**/*.js',
      'src/**/*.js'
    ]
  }
});
