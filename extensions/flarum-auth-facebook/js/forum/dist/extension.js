System.register('flarum/auth/facebook/main', ['flarum/extend', 'flarum/app', 'flarum/components/LogInButtons', 'flarum/components/LogInButton'], function (_export) {
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

      app.initializers.add('flarum-auth-facebook', function () {
        extend(LogInButtons.prototype, 'items', function (items) {
          items.add('facebook', m(
            LogInButton,
            {
              className: 'Button LogInButton--facebook',
              icon: 'facebook',
              path: '/auth/facebook' },
            'Log in with Facebook'
          ));
        });
      });
    }
  };
});