System.register('flarum/auth/github/main', ['flarum/extend', 'flarum/app', 'flarum/components/LogInButtons', 'flarum/components/LogInButton'], function (_export) {
  'use strict';

  var extend, app, LogInButtons, LogInButton;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp['default'];
    }, function (_flarumComponentsLogInButtons) {
      LogInButtons = _flarumComponentsLogInButtons['default'];
    }, function (_flarumComponentsLogInButton) {
      LogInButton = _flarumComponentsLogInButton['default'];
    }],
    execute: function () {

      app.initializers.add('flarum-auth-github', function () {
        extend(LogInButtons.prototype, 'items', function (items) {
          items.add('github', m(
            LogInButton,
            {
              className: 'Button LogInButton--github',
              icon: 'github',
              path: '/auth/github' },
            'Log in with GitHub'
          ));
        });
      });
    }
  };
});