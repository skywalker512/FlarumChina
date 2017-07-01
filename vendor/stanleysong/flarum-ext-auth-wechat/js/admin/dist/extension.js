'use strict';

System.register('stanleysong/auth/wechat/components/WechatSettingsModal', ['flarum/components/SettingsModal'], function (_export, _context) {
  "use strict";

  var SettingsModal, WechatSettingsModal;
  return {
    setters: [function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal.default;
    }],
    execute: function () {
      WechatSettingsModal = function (_SettingsModal) {
        babelHelpers.inherits(WechatSettingsModal, _SettingsModal);

        function WechatSettingsModal() {
          babelHelpers.classCallCheck(this, WechatSettingsModal);
          return babelHelpers.possibleConstructorReturn(this, (WechatSettingsModal.__proto__ || Object.getPrototypeOf(WechatSettingsModal)).apply(this, arguments));
        }

        babelHelpers.createClass(WechatSettingsModal, [{
          key: 'className',
          value: function className() {
            return 'WechatSettingsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('stanleysong-auth-wechat.admin.wechat_settings.title');
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
                app.translator.trans('stanleysong-auth-wechat.admin.wechat_settings.app_id_label')
              ),
              m('input', { className: 'FormControl', bidi: this.setting('stanleysong-auth-wechat.app_id') })
            ), m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                app.translator.trans('stanleysong-auth-wechat.admin.wechat_settings.app_secret_label')
              ),
              m('input', { className: 'FormControl', bidi: this.setting('stanleysong-auth-wechat.app_secret') })
            ), m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                app.translator.trans('stanleysong-auth-wechat.admin.wechat_settings.app_cburl_label')
              ),
              m('input', { className: 'FormControl', bidi: this.setting('stanleysong-auth-wechat.callback_url') })
            )];
          }
        }]);
        return WechatSettingsModal;
      }(SettingsModal);

      _export('default', WechatSettingsModal);
    }
  };
});;
'use strict';

System.register('stanleysong/auth/wechat/main', ['flarum/app', 'stanleysong/auth/wechat/components/WechatSettingsModal'], function (_export, _context) {
  "use strict";

  var app, WechatSettingsModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_stanleysongAuthWechatComponentsWechatSettingsModal) {
      WechatSettingsModal = _stanleysongAuthWechatComponentsWechatSettingsModal.default;
    }],
    execute: function () {

      app.initializers.add('stanleysong-auth-wechat', function () {
        app.extensionSettings['stanleysong-auth-wechat'] = function () {
          return app.modal.show(new WechatSettingsModal());
        };
      });
    }
  };
});