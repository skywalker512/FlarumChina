'use strict';

System.register('wiwatSrt/bestAnswer/main', ['flarum/extend', 'flarum/app', 'flarum/components/PermissionGrid'], function (_export, _context) {
    "use strict";

    var extend, app, PermissionGrid;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }],
        execute: function () {

            app.initializers.add('wiwatSrt-bestAnswer', function () {
                extend(PermissionGrid.prototype, 'replyItems', function (items) {
                    items.add('selectBestAnswer', {
                        icon: 'comment-o',
                        label: app.translator.trans('flarum-best-answer.admin.permissions.best_answer'),
                        permission: 'discussion.selectBestAnswer'
                    });
                });
            });
        }
    };
});