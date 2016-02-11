System.register('flarum/auth/facebook/components/FacebookSettingsModal', ['flarum/components/SettingsModal'], function (_export) {
  'use strict';

  var SettingsModal, FacebookSettingsModal;
  return {
    setters: [function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal['default'];
    }],
    execute: function () {
      FacebookSettingsModal = (function (_SettingsModal) {
        babelHelpers.inherits(FacebookSettingsModal, _SettingsModal);

        function FacebookSettingsModal() {
          babelHelpers.classCallCheck(this, FacebookSettingsModal);
          babelHelpers.get(Object.getPrototypeOf(FacebookSettingsModal.prototype), 'constructor', this).apply(this, arguments);
        }

        babelHelpers.createClass(FacebookSettingsModal, [{
          key: 'className',
          value: function className() {
            return 'FacebookSettingsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return 'Facebook Settings';
          }
        }, {
          key: 'form',
          value: function form() {
            return [m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                'App ID'
              ),
              m('input', { className: 'FormControl', bidi: this.setting('flarum-auth-facebook.app_id') })
            ), m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                'App Secret'
              ),
              m('input', { className: 'FormControl', bidi: this.setting('flarum-auth-facebook.app_secret') })
            )];
          }
        }]);
        return FacebookSettingsModal;
      })(SettingsModal);

      _export('default', FacebookSettingsModal);
    }
  };
});;
System.register('flarum/auth/facebook/main', ['flarum/app', 'flarum/auth/facebook/components/FacebookSettingsModal'], function (_export) {
  'use strict';

  var app, FacebookSettingsModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp['default'];
    }, function (_flarumAuthFacebookComponentsFacebookSettingsModal) {
      FacebookSettingsModal = _flarumAuthFacebookComponentsFacebookSettingsModal['default'];
    }],
    execute: function () {

      app.initializers.add('flarum-auth-facebook', function () {
        app.extensionSettings['flarum-auth-facebook'] = function () {
          return app.modal.show(new FacebookSettingsModal());
        };
      });
    }
  };
});