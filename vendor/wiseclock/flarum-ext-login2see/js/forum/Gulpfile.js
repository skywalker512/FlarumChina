var flarum = require('flarum-gulp');

flarum({
  modules: {
    'wiseclock/flarum-ext-login2see': [
      'src/**/*.js'
    ]
  }
});
