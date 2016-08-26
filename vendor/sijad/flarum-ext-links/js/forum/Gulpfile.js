var gulp = require('flarum-gulp');

gulp({
  modules: {
    'sijad/links': [
      '../lib/**/*.js',
      'src/**/*.js'
    ]
  }
});
