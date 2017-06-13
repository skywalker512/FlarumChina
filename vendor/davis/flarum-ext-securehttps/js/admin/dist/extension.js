'use strict';

System.register('Davis/SecureHttps/components/SecureHttpsSettingsModal', ['flarum/app', 'flarum/extend', 'flarum/components/SettingsModal', 'flarum/components/Switch'], function (_export, _context) {
  var app, extend, SettingsModal, Switch, SecureHttpsSettingsModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal.default;
    }, function (_flarumComponentsSwitch) {
      Switch = _flarumComponentsSwitch.default;
    }],
    execute: function () {
      SecureHttpsSettingsModal = function (_SettingsModal) {
        babelHelpers.inherits(SecureHttpsSettingsModal, _SettingsModal);

        function SecureHttpsSettingsModal() {
          babelHelpers.classCallCheck(this, SecureHttpsSettingsModal);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(SecureHttpsSettingsModal).apply(this, arguments));
        }

        babelHelpers.createClass(SecureHttpsSettingsModal, [{
          key: 'className',
          value: function className() {
            return 'SecureHttpsSettingsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('davis-securehttps.admin.settings.title');
          }
        }, {
          key: 'form',
          value: function form() {
            return [m(
              'div',
              { className: 'Form-group' },
              Switch.component({
                className: "davis-securehttps-switch",
                state: this.setting('davis-securehttps.proxy')(),
                children: app.translator.trans('davis-securehttps.admin.settings.replace'),
                onchange: this.setting('davis-securehttps.proxy')
              })
            )];
          }
        }]);
        return SecureHttpsSettingsModal;
      }(SettingsModal);

      _export('default', SecureHttpsSettingsModal);
    }
  };
});;
'use strict';

System.register('Davis/SecureHttps/main', ['flarum/app', 'flarum/extend', 'Davis/SecureHttps/components/SecureHttpsSettingsModal'], function (_export, _context) {
  var app, extend, SecureHttpsSettingsModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_DavisSecureHttpsComponentsSecureHttpsSettingsModal) {
      SecureHttpsSettingsModal = _DavisSecureHttpsComponentsSecureHttpsSettingsModal.default;
    }],
    execute: function () {

      app.initializers.add('Davis-SecureHttps', function (app) {
        app.extensionSettings['davis-securehttps'] = function () {
          return app.modal.show(new SecureHttpsSettingsModal());
        };
      });
    }
  };
});