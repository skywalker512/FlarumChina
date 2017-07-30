var flarum = require('flarum-gulp');

flarum({
  modules: {
    'Davis/SocialProfile': [
      'src/**/*.js'
    ]
  }
});