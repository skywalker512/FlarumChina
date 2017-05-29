"use strict";

System.register("flagrow/ads/addAdsPane", ["flarum/extend", "flarum/components/AdminNav", "flarum/components/AdminLinkButton", "flagrow/ads/components/AdsPage"], function (_export, _context) {
    "use strict";

    var extend, AdminNav, AdminLinkButton, AdsPage;

    _export("default", function () {
        // create the route
        app.routes['flagrow-ads'] = { path: '/flagrow/ads', component: AdsPage.component() };

        // bind the route we created to the three dots settings button
        app.extensionSettings['flagrow-ads'] = function () {
            return m.route(app.route('flagrow-ads'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            items.add('flagrow-ads', AdminLinkButton.component({
                href: app.route('flagrow-ads'),
                icon: 'audio-description',
                children: 'Ads',
                description: app.translator.trans('flagrow-ads.admin.tab.description')
            }));
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_flagrowAdsComponentsAdsPage) {
            AdsPage = _flagrowAdsComponentsAdsPage.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("flagrow/ads/components/AdsPage", ["flarum/Component", "flarum/components/Button", "flarum/utils/saveSettings", "flarum/components/Alert"], function (_export, _context) {
    "use strict";

    var Component, Button, saveSettings, Alert, UploadPage;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }, function (_flarumComponentsAlert) {
            Alert = _flarumComponentsAlert.default;
        }],
        execute: function () {
            UploadPage = function (_Component) {
                babelHelpers.inherits(UploadPage, _Component);

                function UploadPage() {
                    babelHelpers.classCallCheck(this, UploadPage);
                    return babelHelpers.possibleConstructorReturn(this, (UploadPage.__proto__ || Object.getPrototypeOf(UploadPage)).apply(this, arguments));
                }

                babelHelpers.createClass(UploadPage, [{
                    key: "init",
                    value: function init() {
                        var _this2 = this;

                        // get the saved settings from the database
                        var settings = app.data.settings;

                        this.values = {};

                        // our package prefix (to be added to every field and checkbox in the setting table)
                        this.settingsPrefix = 'flagrow.ads';

                        this.positions = ['under-header', 'between-posts', 'under-nav-items'];

                        this.settings = ['between-n-posts'];

                        // bind the values of the fields and checkboxes to the getter/setter functions
                        this.positions.forEach(function (key) {
                            return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)]);
                        });
                        this.settings.forEach(function (key) {
                            return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)]);
                        });
                    }
                }, {
                    key: "view",
                    value: function view() {
                        var _this3 = this;

                        return [m('div', { className: 'AdsPage' }, [m('form', { onsubmit: this.onsubmit.bind(this) }, m('fieldset', { className: 'AdsPage-settings' }, [m('legend', {}, app.translator.trans('flagrow-ads.admin.settings.between-n-posts')), m('input', {
                            value: this.values['between-n-posts']() || 5,
                            className: 'FormControl',
                            oninput: m.withAttr('value', this.values['between-n-posts'])
                        })]), this.positions.map(function (position) {
                            return m('fieldset', { className: 'AdsPage-' + position }, [m('legend', {}, app.translator.trans('flagrow-ads.admin.positions.' + position + '.title')), m('textarea', {
                                value: _this3.values[position]() || null,
                                className: 'FormControl',
                                placeholder: app.translator.trans('flagrow-ads.admin.positions.' + position + '.placeholder'),
                                oninput: m.withAttr('value', _this3.values[position])
                            })]);
                        }), Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-ads.admin.buttons.save'),
                            loading: this.loading,
                            disabled: !this.changed()
                        }))])];
                    }
                }, {
                    key: "changed",
                    value: function changed() {
                        var _this4 = this;

                        var positionsChecked = this.positions.some(function (key) {
                            return _this4.values[key]() !== app.data.settings[_this4.addPrefix(key)];
                        });
                        var settingsChecked = this.settings.some(function (key) {
                            return _this4.values[key]() !== app.data.settings[_this4.addPrefix(key)];
                        });
                        return positionsChecked || settingsChecked;
                    }
                }, {
                    key: "onsubmit",
                    value: function onsubmit(e) {
                        var _this5 = this;

                        // prevent the usual form submit behaviour
                        e.preventDefault();

                        // if the page is already saving, do nothing
                        if (this.loading) return;

                        // prevents multiple savings
                        this.loading = true;

                        // remove previous success popup
                        app.alerts.dismiss(this.successAlert);

                        var settings = {};

                        // gets all the values from the form
                        this.positions.forEach(function (key) {
                            return settings[_this5.addPrefix(key)] = _this5.values[key]();
                        });
                        this.settings.forEach(function (key) {
                            return settings[_this5.addPrefix(key)] = _this5.values[key]();
                        });

                        // actually saves everything in the database
                        saveSettings(settings).then(function () {
                            // on success, show popup
                            app.alerts.show(_this5.successAlert = new Alert({
                                type: 'success',
                                children: app.translator.trans('core.admin.basics.saved_message')
                            }));
                        }).catch(function () {}).then(function () {
                            // return to the initial state and redraw the page
                            _this5.loading = false;
                            m.redraw();
                        });
                    }
                }, {
                    key: "addPrefix",
                    value: function addPrefix(key) {
                        return this.settingsPrefix + '.' + key;
                    }
                }]);
                return UploadPage;
            }(Component);

            _export("default", UploadPage);
        }
    };
});;
"use strict";

System.register("flagrow/ads/main", ["flarum/extend", "flarum/app", "flagrow/ads/addAdsPane"], function (_export, _context) {
    "use strict";

    var extend, app, addAdsPane;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flagrowAdsAddAdsPane) {
            addAdsPane = _flagrowAdsAddAdsPane.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-ads', function (app) {
                // add the admin pane
                addAdsPane();
            });
        }
    };
});