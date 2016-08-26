var gulp = require('flarum-gulp');

gulp({
  files: [
    'bower_components/html.sortable/dist/html.sortable.js'
  ],
  modules: {
    'sijad/links': [
      '../lib/**/*.js',
      'src/**/*.js'
    ]
  }
});
