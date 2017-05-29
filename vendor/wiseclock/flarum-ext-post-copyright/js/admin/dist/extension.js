System.register('wiseclock/flarum-ext-post-copyright/components/PostCopyrightSettingsModal', ['flarum/components/SettingsModal', 'flarum/components/Switch', 'flarum/app'], function (_export) {
    'use strict';

    var SettingsModal, Switch, app, PostCopyrightSettingsModal;
    return {
        setters: [function (_flarumComponentsSettingsModal) {
            SettingsModal = _flarumComponentsSettingsModal['default'];
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch['default'];
        }, function (_flarumApp) {
            app = _flarumApp['default'];
        }],
        execute: function () {
            PostCopyrightSettingsModal = (function (_SettingsModal) {
                babelHelpers.inherits(PostCopyrightSettingsModal, _SettingsModal);

                function PostCopyrightSettingsModal() {
                    babelHelpers.classCallCheck(this, PostCopyrightSettingsModal);
                    babelHelpers.get(Object.getPrototypeOf(PostCopyrightSettingsModal.prototype), 'constructor', this).apply(this, arguments);
                }

                babelHelpers.createClass(PostCopyrightSettingsModal, [{
                    key: 'className',
                    value: function className() {
                        return 'WiseClockPostCopyrightSettingsModal Modal--medium';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('wiseclock-post-copyright.admin.settings.title');
                    }
                }, {
                    key: 'getStored',
                    value: function getStored() {
                        var values = this.setting('wiseclock.post-copyright.defaults', '[true, true, true, true]')();
                        return JSON.parse(values);
                    }
                }, {
                    key: 'getDefaults',
                    value: function getDefaults(index) {
                        return this.getStored()[index];
                    }
                }, {
                    key: 'setDefaults',
                    value: function setDefaults(index, value) {
                        var values = this.getStored();
                        values[index] = value;
                        var valueString = JSON.stringify(values);
                        this.setting('wiseclock.post-copyright.defaults')(valueString);
                    }
                }, {
                    key: 'form',
                    value: function form() {
                        var _this = this;

                        return [m('div', { className: 'WiseClockPostCopyright' }, [m('fieldset', { className: 'WiseClockPostCopyright-default-ui' }, [m('legend', {}, app.translator.trans('wiseclock-post-copyright.admin.settings.ui.title')), Switch.component({
                            state: JSON.parse(this.setting('wiseclock.post-copyright.primary_color', 0)()),
                            onchange: this.setting('wiseclock.post-copyright.primary_color'),
                            children: app.translator.trans('wiseclock-post-copyright.admin.settings.ui.primary_color')
                        }), Switch.component({
                            state: JSON.parse(this.setting('wiseclock.post-copyright.discussions_only', 0)()),
                            onchange: this.setting('wiseclock.post-copyright.discussions_only'),
                            children: app.translator.trans('wiseclock-post-copyright.admin.settings.ui.discussions_only')
                        }), Switch.component({
                            state: JSON.parse(this.setting('wiseclock.post-copyright.align_right', 0)()),
                            onchange: this.setting('wiseclock.post-copyright.align_right'),
                            children: app.translator.trans('wiseclock-post-copyright.admin.settings.ui.align_right')
                        }), m('label', {}, app.translator.trans('wiseclock-post-copyright.admin.settings.ui.copyright')), m('input', { className: 'FormControl', bidi: this.setting('wiseclock.post-copyright.icon', '© ') })]), m('fieldset', { className: 'WiseClockPostCopyright-default-edit' }, [m('legend', {}, app.translator.trans('wiseclock-post-copyright.admin.settings.edit.title')), Switch.component({
                            state: JSON.parse(this.setting('wiseclock.post-copyright.allow_trespass', 0)()),
                            onchange: this.setting('wiseclock.post-copyright.allow_trespass'),
                            children: app.translator.trans('wiseclock-post-copyright.admin.settings.edit.allow_trespass')
                        })]), m('fieldset', { className: 'WiseClockPostCopyright-default-switch' }, [m('legend', {}, app.translator.trans('wiseclock-post-copyright.admin.settings.defaults.title')), m('div', { className: 'helpText' }, app.translator.trans('wiseclock-post-copyright.admin.settings.defaults.help')), Switch.component({
                            state: this.getDefaults(0),
                            onchange: function onchange(value) {
                                _this.setDefaults(0, value);
                            },
                            children: app.translator.trans('wiseclock-post-copyright.admin.settings.defaults.authorized')
                        }), Switch.component({
                            state: this.getDefaults(1),
                            onchange: function onchange(value) {
                                _this.setDefaults(1, value);
                            },
                            children: app.translator.trans('wiseclock-post-copyright.admin.settings.defaults.sourced')
                        }), Switch.component({
                            state: this.getDefaults(2),
                            onchange: function onchange(value) {
                                _this.setDefaults(2, value);
                            },
                            children: app.translator.trans('wiseclock-post-copyright.admin.settings.defaults.paid')
                        }), Switch.component({
                            state: this.getDefaults(3),
                            onchange: function onchange(value) {
                                _this.setDefaults(3, value);
                            },
                            children: app.translator.trans('wiseclock-post-copyright.admin.settings.defaults.prohibited')
                        })]), m('fieldset', { className: 'WiseClockPostCopyright-addition' }, [m('legend', {}, app.translator.trans('wiseclock-post-copyright.admin.settings.addition.title')), m('div', { className: 'helpText' }, app.translator.trans('wiseclock-post-copyright.admin.settings.addition.help')), m('pre', 'mit,MIT License,You have to follow <a href="https://opensource.org/licenses/MIT">The MIT License</a> in order to reproduce this post.'), m('div', { className: 'helpText' }, app.translator.trans('wiseclock-post-copyright.admin.settings.addition.notes')), m('textarea', {
                            className: 'FormControl',
                            rows: 6,
                            value: this.setting('wiseclock.post-copyright.addition')(),
                            oninput: m.withAttr('value', this.setting('wiseclock.post-copyright.addition'))
                        })])])];
                    }
                }]);
                return PostCopyrightSettingsModal;
            })(SettingsModal);

            _export('default', PostCopyrightSettingsModal);
        }
    };
});;
System.register('wiseclock/flarum-ext-post-copyright/main', ['flarum/extend', 'flarum/app', 'wiseclock/flarum-ext-post-copyright/components/PostCopyrightSettingsModal'], function (_export) {
    'use strict';

    var extend, app, PostCopyrightSettingsModal;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp['default'];
        }, function (_wiseclockFlarumExtPostCopyrightComponentsPostCopyrightSettingsModal) {
            PostCopyrightSettingsModal = _wiseclockFlarumExtPostCopyrightComponentsPostCopyrightSettingsModal['default'];
        }],
        execute: function () {

            app.initializers.add('wiseclock-post-copyright', function () {
                app.extensionSettings['wiseclock-post-copyright'] = function () {
                    return app.modal.show(new PostCopyrightSettingsModal());
                };
            });
        }
    };
});