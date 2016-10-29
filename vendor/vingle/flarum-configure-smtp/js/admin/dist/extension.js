'use strict';

System.register('vingle/configure/smtp/components/ConfigureSMTPSettingModal', ['flarum/components/SettingsModal'], function (_export, _context) {
    var SettingsModal, ConfigureSMTPSettingModal;
    return {
        setters: [function (_flarumComponentsSettingsModal) {
            SettingsModal = _flarumComponentsSettingsModal.default;
        }],
        execute: function () {
            ConfigureSMTPSettingModal = function (_SettingsModal) {
                babelHelpers.inherits(ConfigureSMTPSettingModal, _SettingsModal);

                function ConfigureSMTPSettingModal() {
                    babelHelpers.classCallCheck(this, ConfigureSMTPSettingModal);
                    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ConfigureSMTPSettingModal).apply(this, arguments));
                }

                babelHelpers.createClass(ConfigureSMTPSettingModal, [{
                    key: 'className',
                    value: function className() {
                        return 'Modal--small';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return 'SMTP 设置';
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
                                ' 驱动方式 '
                            ),
                            m(
                                'select',
                                { className: 'FormControl', bidi: this.setting('mail_driver') },
                                m(
                                    'option',
                                    { value: 'smtp' },
                                    'smtp'
                                ),
                                m(
                                    'option',
                                    { value: 'mail' },
                                    'mail'
                                )
                            ),
                            '默认使用mail，若要使用下面的配置请选择SMTP'
                        ), m(
                            'div',
                            { className: 'Form-group' },
                            m(
                                'label',
                                null,
                                ' 验证方式 '
                            ),
                            m('input', {
                                className: 'FormControl',
                                bidi: this.setting('mail_encryption')
                            }),
                            '若要使用SSL协议请输入ssl，若不需要请不填'
                        ), m(
                            'div',
                            { className: 'Form-group' },
                            m(
                                'label',
                                null,
                                ' SMTP 端口 '
                            ),
                            ' ',
                            m('input', { className: 'FormControl',
                                type: 'number',
                                min: '0',
                                bidi: this.setting('mail_port')
                            }),
                            '25'
                        ), m(
                            'div',
                            { className: 'Form-group' },
                            m(
                                'label',
                                null,
                                ' SMTP 地址 '
                            ),
                            m('input', {
                                className: 'FormControl',
                                bidi: this.setting('mail_host')
                            }),
                            'smtp.flarum.org'
                        ), m(
                            'div',
                            { className: 'Form-group' },
                            m(
                                'label',
                                null,
                                ' SMTP 用户名 '
                            ),
                            m('input', {
                                className: 'FormControl',
                                bidi: this.setting('mail_username')
                            }),
                            'smtp@flarum.org'
                        ), m(
                            'div',
                            { className: 'Form-group' },
                            m(
                                'label',
                                null,
                                ' SMTP 密码 '
                            ),
                            m('input', {
                                type: 'password',
                                className: 'FormControl',
                                bidi: this.setting('mail_password')
                            }),
                            'password'
                        ), m(
                            'div',
                            { className: 'Form-group' },
                            m(
                                'label',
                                null,
                                ' 发件人 '
                            ),
                            m('input', {
                                className: 'FormControl',
                                bidi: this.setting('mail_from')
                            }),
                            'smtp@flarum.org'
                        )];
                    }
                }]);
                return ConfigureSMTPSettingModal;
            }(SettingsModal);

            _export('default', ConfigureSMTPSettingModal);
        }
    };
});;
'use strict';

System.register('vingle/configure/smtp/main', ['flarum/app', 'vingle/configure/smtp/components/ConfigureSMTPSettingModal'], function (_export, _context) {
  var app, ConfigureSMTPSettingModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_vingleConfigureSmtpComponentsConfigureSMTPSettingModal) {
      ConfigureSMTPSettingModal = _vingleConfigureSmtpComponentsConfigureSMTPSettingModal.default;
    }],
    execute: function () {

      app.initializers.add('vingle-configure-smtp', function () {
        app.extensionSettings['vingle-configure-smtp'] = function () {
          return app.modal.show(new ConfigureSMTPSettingModal());
        };
      });
    }
  };
});