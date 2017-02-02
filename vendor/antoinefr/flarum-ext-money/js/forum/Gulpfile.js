var flarum = require('flarum-gulp');

flarum({
  modules: {
    'antoinefr/money': [
      'src/**/*.js'
    ]
  }
});