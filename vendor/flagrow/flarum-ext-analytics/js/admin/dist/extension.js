'use strict';

System.register('flagrow/analytics/addAnalyticsPage', ['flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'flagrow/analytics/components/AnalyticsPage'], function (_export, _context) {
    "use strict";

    var extend, AdminNav, AdminLinkButton, AnalyticsPage;

    _export('default', function () {
        // add the Analytics tab to the admin navigation menu if piwik is enabled
        if (m.prop(app.data.settings['flagrow.analytics.statusPiwik'])() && m.prop(app.data.settings['flagrow.analytics.piwikUrl'])() && m.prop(app.data.settings['flagrow.analytics.piwikSiteId'])() && m.prop(app.data.settings['flagrow.analytics.piwikAuthToken'])()) {

            app.routes['analytics'] = {
                path: '/analytics',
                component: AnalyticsPage.component()
            };

            extend(AdminNav.prototype, 'items', function (items) {
                items.add('analytics', AdminLinkButton.component({
                    href: app.route('analytics'),
                    icon: 'line-chart',
                    children: app.translator.trans('flagrow-analytics.admin.page.nav.title'),
                    description: app.translator.trans('flagrow-analytics.admin.page.nav.description')
                }));
            });
        }
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_flagrowAnalyticsComponentsAnalyticsPage) {
            AnalyticsPage = _flagrowAnalyticsComponentsAnalyticsPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/analytics/components/AnalyticsPage', ['flarum/Component'], function (_export, _context) {
    "use strict";

    var Component, AnalyticsPage;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }],
        execute: function () {
            AnalyticsPage = function (_Component) {
                babelHelpers.inherits(AnalyticsPage, _Component);

                function AnalyticsPage() {
                    babelHelpers.classCallCheck(this, AnalyticsPage);
                    return babelHelpers.possibleConstructorReturn(this, (AnalyticsPage.__proto__ || Object.getPrototypeOf(AnalyticsPage)).apply(this, arguments));
                }

                babelHelpers.createClass(AnalyticsPage, [{
                    key: 'view',
                    value: function view() {
                        var piwikUrl = app.data.settings['flagrow.analytics.piwikUrl'];

                        // Use protocol-relative url if the url contains no protocol
                        if (piwikUrl.indexOf('http://') === -1 && piwikUrl.indexOf('https://') === -1 && piwikUrl.indexOf('//') === -1) {
                            piwikUrl = '//' + piwikUrl;
                        }

                        // Add trailing slash if necessary
                        if (piwikUrl[piwikUrl.length - 1] !== '/') {
                            piwikUrl += '/';
                        }

                        //Call the piwik application
                        this.url = piwikUrl + 'index.php';
                        this.url += '?idSite=' + app.data.settings['flagrow.analytics.piwikSiteId'];
                        this.url += '&token_auth=' + app.data.settings['flagrow.analytics.piwikAuthToken'];
                        this.url += '&module=Widgetize&action=iframe&moduleToWidgetize=Dashboard&actionToWidgetize=index&period=month&date=today';

                        return [m('div', { className: 'analyticsPage' }, [m('div', { className: 'piwik' }, [m('label', ['Piwik']), m('iframe', {
                            frameborder: '0',
                            src: this.url
                        })])])];
                    }
                }]);
                return AnalyticsPage;
            }(Component);

            _export('default', AnalyticsPage);
        }
    };
});;
'use strict';

System.register('flagrow/analytics/components/AnalyticsSettingsModal', ['flarum/components/SettingsModal', 'flarum/components/Select', 'flarum/components/Switch'], function (_export, _context) {
    "use strict";

    var SettingsModal, Select, Switch, settingsPrefix, AnalyticsSettingsModal;
    return {
        setters: [function (_flarumComponentsSettingsModal) {
            SettingsModal = _flarumComponentsSettingsModal.default;
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect.default;
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch.default;
        }],
        execute: function () {
            settingsPrefix = 'flagrow.analytics.';

            AnalyticsSettingsModal = function (_SettingsModal) {
                babelHelpers.inherits(AnalyticsSettingsModal, _SettingsModal);

                function AnalyticsSettingsModal() {
                    babelHelpers.classCallCheck(this, AnalyticsSettingsModal);
                    return babelHelpers.possibleConstructorReturn(this, (AnalyticsSettingsModal.__proto__ || Object.getPrototypeOf(AnalyticsSettingsModal)).apply(this, arguments));
                }

                babelHelpers.createClass(AnalyticsSettingsModal, [{
                    key: 'className',
                    value: function className() {
                        return 'AnalyticsSettingsModal Modal--small';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('flagrow-analytics.admin.popup.title');
                    }
                }, {
                    key: 'form',
                    value: function form() {
                        var piwikTrackAccountsSetting = this.setting(settingsPrefix + 'piwikTrackAccounts');

                        if (!piwikTrackAccountsSetting()) {
                            piwikTrackAccountsSetting('none');
                        }

                        return [m('h3', app.translator.trans('flagrow-analytics.admin.popup.section.googleAnalytics')), m('.Form-group', [m('label', Switch.component({
                            state: this.setting(settingsPrefix + 'statusGoogle')() > 0,
                            onchange: this.setting(settingsPrefix + 'statusGoogle'),
                            children: app.translator.trans('flagrow-analytics.admin.popup.field.statusGoogle')
                        }))]), this.setting(settingsPrefix + 'statusGoogle')() > 0 ? [m('.Form-group', [m('label', app.translator.trans('flagrow-analytics.admin.popup.field.googleTrackingCode')), m('input.FormControl', {
                            bidi: this.setting(settingsPrefix + 'googleTrackingCode'),
                            placeholder: 'UA-XXXXXXXX-X'
                        })])] : null, m('h3', app.translator.trans('flagrow-analytics.admin.popup.section.piwik')), m('.Form-group', [m('label', Switch.component({
                            state: this.setting(settingsPrefix + 'statusPiwik')() > 0,
                            onchange: this.setting(settingsPrefix + 'statusPiwik'),
                            children: app.translator.trans('flagrow-analytics.admin.popup.field.statusPiwik')
                        }))]), this.setting(settingsPrefix + 'statusPiwik')() > 0 ? [m('.Form-group', [m('label', app.translator.trans('flagrow-analytics.admin.popup.field.piwikUrl')), m('input.FormControl', {
                            bidi: this.setting(settingsPrefix + 'piwikUrl'),
                            placeholder: 'piwik.example.com'
                        })]), m('.Form-group', [m('label', app.translator.trans('flagrow-analytics.admin.popup.field.piwikSiteId')), m('input.FormControl', {
                            bidi: this.setting(settingsPrefix + 'piwikSiteId')
                        })]), m('.Form-group', [m('label', Switch.component({
                            state: this.setting(settingsPrefix + 'piwikTrackSubdomain')() > 0,
                            onchange: this.setting(settingsPrefix + 'piwikTrackSubdomain'),
                            children: app.translator.trans('flagrow-analytics.admin.popup.field.piwikTrackSubdomain')
                        }))]), m('.Form-group', [m('label', Switch.component({
                            state: this.setting(settingsPrefix + 'piwikPrependDomain')() > 0,
                            onchange: this.setting(settingsPrefix + 'piwikPrependDomain'),
                            children: app.translator.trans('flagrow-analytics.admin.popup.field.piwikPrependDomain')
                        }))]), m('.Form-group', [m('label', Switch.component({
                            state: this.setting(settingsPrefix + 'piwikHideAliasUrl')() > 0,
                            onchange: this.setting(settingsPrefix + 'piwikHideAliasUrl'),
                            children: app.translator.trans('flagrow-analytics.admin.popup.field.piwikHideAliasUrl')
                        }))]), this.setting(settingsPrefix + 'piwikHideAliasUrl')() > 0 ? [m('.Form-group', [m('label', app.translator.trans('flagrow-analytics.admin.popup.field.piwikAliasUrl')), m('input.FormControl', {
                            bidi: this.setting(settingsPrefix + 'piwikAliasUrl')
                        })])] : null, m('.Form-group', [m('label', app.translator.trans('flagrow-analytics.admin.popup.field.piwikTrackAccounts')), Select.component({
                            options: {
                                none: app.translator.trans('flagrow-analytics.admin.popup.trackAccounts.none'),
                                username: app.translator.trans('flagrow-analytics.admin.popup.trackAccounts.username'),
                                email: app.translator.trans('flagrow-analytics.admin.popup.trackAccounts.email')
                            },
                            value: piwikTrackAccountsSetting(),
                            onchange: piwikTrackAccountsSetting
                        })]), m('.Form-group', [m('label', app.translator.trans('flagrow-analytics.admin.popup.field.piwikAuthToken')), m('input.FormControl', {
                            bidi: this.setting(settingsPrefix + 'piwikAuthToken'),
                            placeholder: '00112233445566778899aabbccddeeff'
                        }), m('.helpText', app.translator.trans('flagrow-analytics.admin.popup.placeholder.piwikAuthToken'))])] : null];
                    }
                }]);
                return AnalyticsSettingsModal;
            }(SettingsModal);

            _export('default', AnalyticsSettingsModal);
        }
    };
});;
'use strict';

System.register('flagrow/analytics/main', ['flarum/extend', 'flarum/app', 'flagrow/analytics/components/AnalyticsSettingsModal', 'flagrow/analytics/addAnalyticsPage'], function (_export, _context) {
    "use strict";

    var extend, app, AnalyticsSettingsModal, addAnalyticsPage;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flagrowAnalyticsComponentsAnalyticsSettingsModal) {
            AnalyticsSettingsModal = _flagrowAnalyticsComponentsAnalyticsSettingsModal.default;
        }, function (_flagrowAnalyticsAddAnalyticsPage) {
            addAnalyticsPage = _flagrowAnalyticsAddAnalyticsPage.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-analytics', function (app) {
                app.extensionSettings['flagrow-analytics'] = function () {
                    return app.modal.show(new AnalyticsSettingsModal());
                };
                addAnalyticsPage();
            });
        }
    };
});