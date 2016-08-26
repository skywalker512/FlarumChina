var gulp = require('flarum-gulp');

gulp({
  modules: {
    'sijad/pages': [
      '../lib/**/*.js',
      'src/**/*.js'
    ]
  }
});
