var flarum = require('flarum-gulp');

flarum({
  modules: {
    'wiseclock/flarum-ext-profile-image-crop': [
      'src/**/*.js'
    ]
  }
});
