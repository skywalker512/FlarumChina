var gulp = require('flarum-gulp');
var bowerDir = '../bower_components';

gulp({
  files: [
    bowerDir + '/emojione/lib/js/emojione.js'
  ],
  modules: {
    'reflar/reactions': [
      'src/**/*.js',
      '../lib/**/*.js'
    ]
  }
});
