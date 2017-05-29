var flarum = require('flarum-gulp');

flarum({
  modules: {
    'wiseclock/flarum-ext-post-copyright': [
      'src/**/*.js'
    ]
  }
});
