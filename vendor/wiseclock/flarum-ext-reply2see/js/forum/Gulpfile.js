var flarum = require('flarum-gulp');

flarum({
  modules: {
    'wiseclock/flarum-ext-reply2see': [
      'src/**/*.js'
    ]
  }
});
