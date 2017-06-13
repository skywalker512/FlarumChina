var flarum = require('flarum-gulp');

flarum({
  modules: {
    'Davis/SecureHttps': [
      'src/**/*.js'
    ]
  }
});