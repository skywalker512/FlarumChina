var flarum = require('flarum-gulp');

flarum({
  modules: {
    'vingle/configure/smtp': [
      'src/**/*.js'
    ]
  }
});
