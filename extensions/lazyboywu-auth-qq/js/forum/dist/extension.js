System.register('lazyboywu/auth/qq/main', ['flarum/extend', 'flarum/app', 'flarum/components/LogInButtons', 'flarum/components/LogInButton', 'flarum/components/HeaderSecondary'], function (_export) {
  'use strict';

  // 导航栏右侧
  var extend, app, LogInButtons, LogInButton, HeaderSecondary;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp['default'];
    }, function (_flarumComponentsLogInButtons) {
      LogInButtons = _flarumComponentsLogInButtons['default'];
    }, function (_flarumComponentsLogInButton) {
      LogInButton = _flarumComponentsLogInButton['default'];
    }, function (_flarumComponentsHeaderSecondary) {
      HeaderSecondary = _flarumComponentsHeaderSecondary['default'];
    }],
    execute: function () {

      app.initializers.add('lazyboywu-auth-qq', function () {
        extend(LogInButtons.prototype, 'items', function (items) {
          items.add('qq', LogInButton.component({
            //children: app.translator.trans('flarum_auth_qq.forum.log_in.with_qq_button'),
            children: 'Log in with QQ',
            icon: 'qq',
            className: 'Button LogInButton--qq',
            path: '/auth/qq'
          }));
        });

        // 导航栏右侧
        extend(HeaderSecondary.prototype, 'items', function (items) {
          if (app.session.user) {
            return;
          }
          items.add('qq', LogInButton.component({
            children: '',
            icon: 'qq',
            className: 'Button Button--link Button--qq',
            path: '/auth/qq'
          }));
        });
      });
    }
  };
});