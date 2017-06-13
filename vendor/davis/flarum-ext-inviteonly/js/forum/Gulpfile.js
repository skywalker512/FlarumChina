var flarum = require('flarum-gulp');

flarum({
  modules: {
    'Davis/InviteOnly': [
      'src/**/*.js'
    ]
  }
});