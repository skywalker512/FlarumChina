System.register('wiseclock/flarum-ext-login2see/components/Login2SeeSettingsModal', ['flarum/components/SettingsModal', 'flarum/components/Switch', 'flarum/components/Select', 'flarum/app'], function (_export) {
    'use strict';

    var SettingsModal, Switch, Select, app, Login2SeeSettingsModal;
    return {
        setters: [function (_flarumComponentsSettingsModal) {
            SettingsModal = _flarumComponentsSettingsModal['default'];
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch['default'];
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect['default'];
        }, function (_flarumApp) {
            app = _flarumApp['default'];
        }],
        execute: function () {
            Login2SeeSettingsModal = (function (_SettingsModal) {
                babelHelpers.inherits(Login2SeeSettingsModal, _SettingsModal);

                function Login2SeeSettingsModal() {
                    babelHelpers.classCallCheck(this, Login2SeeSettingsModal);

                    babelHelpers.get(Object.getPrototypeOf(Login2SeeSettingsModal.prototype), 'constructor', this).call(this);
                    this.linkOptions = {
                        'no_replace': app.translator.trans('wiseclock-login2see.admin.link.no_replace'),
                        'replace_address': app.translator.trans('wiseclock-login2see.admin.link.replace_address'),
                        'replace_all': app.translator.trans('wiseclock-login2see.admin.link.replace_all')
                    };
                }

                babelHelpers.createClass(Login2SeeSettingsModal, [{
                    key: 'className',
                    value: function className() {
                        return 'Login2SeeSettingsModal Modal--small';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('wiseclock-login2see.admin.title');
                    }
                }, {
                    key: 'form',
                    value: function form() {
                        return [m('div', { className: 'WiseClockLogin2See' }, [m('fieldset', { className: 'WiseClockLogin2See-post' }, [m('legend', {}, app.translator.trans('wiseclock-login2see.admin.post.title')), m('div', { className: 'helpText' }, app.translator.trans('wiseclock-login2see.admin.post.help')), m('input', { className: 'FormControl', bidi: this.setting('wiseclock.login2see.post', '100') })]), m('fieldset', { className: 'WiseClockLogin2See-link' }, [m('legend', {}, app.translator.trans('wiseclock-login2see.admin.link.title')), Select.component({
                            options: this.linkOptions,
                            onchange: this.setting('wiseclock.login2see.link', Object.keys(this.linkOptions)[1]),
                            value: this.setting('wiseclock.login2see.link', Object.keys(this.linkOptions)[1])()
                        })]), m('fieldset', { className: 'WiseClockLogin2See-image' }, [m('legend', {}, app.translator.trans('wiseclock-login2see.admin.image.title')), Switch.component({
                            state: JSON.parse(this.setting('wiseclock.login2see.image', 0)()),
                            onchange: this.setting('wiseclock.login2see.image', 1),
                            children: app.translator.trans('wiseclock-login2see.admin.image.label')
                        })]), m('fieldset', { className: 'WiseClockLogin2See-php' }, [m('legend', {}, app.translator.trans('wiseclock-login2see.admin.php.title')), m('div', { className: 'helpText' }, app.translator.trans('wiseclock-login2see.admin.php.help')), Switch.component({
                            state: JSON.parse(this.setting('wiseclock.login2see.php', 0)()),
                            onchange: this.setting('wiseclock.login2see.php', 1),
                            children: app.translator.trans('wiseclock-login2see.admin.php.label')
                        })])])];
                    }
                }]);
                return Login2SeeSettingsModal;
            })(SettingsModal);

            _export('default', Login2SeeSettingsModal);
        }
    };
});;
System.register('wiseclock/flarum-ext-login2see/main', ['flarum/extend', 'flarum/app', 'wiseclock/flarum-ext-login2see/components/Login2SeeSettingsModal'], function (_export) {
    'use strict';

    var extend, app, Login2SeeSettingsModal;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp['default'];
        }, function (_wiseclockFlarumExtLogin2seeComponentsLogin2SeeSettingsModal) {
            Login2SeeSettingsModal = _wiseclockFlarumExtLogin2seeComponentsLogin2SeeSettingsModal['default'];
        }],
        execute: function () {

            app.initializers.add('wiseclock-login2see', function () {
                app.extensionSettings['wiseclock-login2see'] = function () {
                    return app.modal.show(new Login2SeeSettingsModal());
                };
            });
        }
    };
});