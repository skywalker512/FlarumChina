'use strict';

System.register('flagrow/analytics/main', ['flarum/extend', 'flarum/app', 'flarum/components/Page'], function (_export, _context) {
    "use strict";

    var extend, app, Page;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-analytics', function (app) {
                extend(Page.prototype, 'init', function (vdom) {
                    if (typeof ga !== 'undefined') {
                        ga('send', 'pageview', { page: m.route() });
                    }
                    if (typeof _paq !== 'undefined') {
                        _paq.push(['setCustomUrl', m.route()]);
                        _paq.push(['trackPageView']);
                    }
                });
            });
        }
    };
});