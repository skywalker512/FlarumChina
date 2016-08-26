var gulp = require('flarum-gulp')

gulp({
  files: [
    'bower_components/jquery-details/jquery.details.min.js'
  ],
  modules: {
    'sijad/details': [
      'src/**/*.js'
    ]
  }
})
