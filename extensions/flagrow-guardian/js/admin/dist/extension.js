System.register('hyn/guardian/addGuardianPane', ['flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'hyn/guardian/components/GuardianPage'], function (_export) {
  'use strict';

  var extend, AdminNav, AdminLinkButton, GuardianPage;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsAdminNav) {
      AdminNav = _flarumComponentsAdminNav['default'];
    }, function (_flarumComponentsAdminLinkButton) {
      AdminLinkButton = _flarumComponentsAdminLinkButton['default'];
    }, function (_hynGuardianComponentsGuardianPage) {
      GuardianPage = _hynGuardianComponentsGuardianPage['default'];
    }],
    execute: function () {
      _export('default', function () {
        app.routes.guardian = { path: '/guardian', component: GuardianPage.component() };

        app.extensionSettings['hyn-guardian'] = function () {
          return m.route(app.route('guardian'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
          items.add('guardian', AdminLinkButton.component({
            href: app.route('guardian'),
            icon: 'user-secret',
            children: app.translator.trans('hyn-guardian.admin.nav.guardian_button'),
            description: app.translator.trans('hyn-guardian.admin.nav.guardian_text')
          }));
        });
      });
    }
  };
});;
System.register('hyn/guardian/components/GuardianPage', ['flarum/Component', 'flarum/components/Button', 'flarum/utils/humanTime', 'flarum/utils/ItemList', 'flarum/helpers/avatar', 'flarum/helpers/username', 'flarum/helpers/icon', 'flarum/components/UserBio', 'flarum/components/AvatarEditor', 'flarum/helpers/listItems'], function (_export) {

    //import EditTagModal from 'flarum/tags/components/EditTagModal';
    //import TagSettingsModal from 'flarum/tags/components/TagSettingsModal';
    //import tagIcon from 'flarum/tags/helpers/tagIcon';
    //import sortTags from 'flarum/tags/utils/sortTags';

    'use strict';

    var Component, Button, humanTime, ItemList, avatar, username, icon, UserBio, AvatarEditor, listItems, GuardianPage;
    function userItem(user) {
        return m('tr', { dataId: user.id(), className: 'PermissionGrid-child' }, [m('th', [m('a', { href: app.forum.attribute('baseUrl') + '/u/' + user.username() }, user.username())]), m('td', humanTime(user.joinTime())), m('td', user.lastSeenTime() ? humanTime(user.lastSeenTime()) : app.translator.trans('hyn-guardian.admin.grid.user.states.never_visited')), m('td', user.isActivated() ? icon('check') : icon('close')), m('td', user.badges().toArray().length ? m('ul', { className: 'UserCard-badges badges' }, listItems(user.badges().toArray())) : ''), m('td', [m('button', { className: 'Button Button-Default' }, app.translator.trans('hyn-guardian.admin.grid.user.details'))])]);
    }

    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent['default'];
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton['default'];
        }, function (_flarumUtilsHumanTime) {
            humanTime = _flarumUtilsHumanTime['default'];
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList['default'];
        }, function (_flarumHelpersAvatar) {
            avatar = _flarumHelpersAvatar['default'];
        }, function (_flarumHelpersUsername) {
            username = _flarumHelpersUsername['default'];
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon['default'];
        }, function (_flarumComponentsUserBio) {
            UserBio = _flarumComponentsUserBio['default'];
        }, function (_flarumComponentsAvatarEditor) {
            AvatarEditor = _flarumComponentsAvatarEditor['default'];
        }, function (_flarumHelpersListItems) {
            listItems = _flarumHelpersListItems['default'];
        }],
        execute: function () {
            GuardianPage = (function (_Component) {
                babelHelpers.inherits(GuardianPage, _Component);

                function GuardianPage() {
                    babelHelpers.classCallCheck(this, GuardianPage);
                    babelHelpers.get(Object.getPrototypeOf(GuardianPage.prototype), 'constructor', this).apply(this, arguments);
                }

                babelHelpers.createClass(GuardianPage, [{
                    key: 'init',
                    value: function init() {
                        this.users = [];
                        this.sorting = 'username';
                        this.offset = 0;
                        this.limit = 20;

                        this.oldOffset = null;

                        this.queryList();
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        return m('div', { className: 'PermissionsPage container' }, [m('table', { className: 'PermissionGrid' }, [m('thead', [m('tr', [m('th', ''), m('th', app.translator.trans('hyn-guardian.admin.grid.user.joined_at')), m('th', app.translator.trans('hyn-guardian.admin.grid.user.last_seen_at')), m('th', app.translator.trans('hyn-guardian.admin.grid.user.activated')), m('th', app.translator.trans('hyn-guardian.admin.grid.user.badges')), m('th', '')])]), m('tbody', this.users.map(userItem)), m('tfoot', [m('button', {
                            className: 'Button Button-Default',
                            onclick: this.movePage.bind(this, -1)
                        }, 'Previous'), m('button', { className: 'Button Button-Default', onclick: this.movePage.bind(this, 1) }, 'Next')])])]);
                    }
                }, {
                    key: 'queryList',
                    value: function queryList() {
                        var _this = this;

                        app.store.find('users', { sort: this.sorting, page: { limit: this.limit, offset: this.offset } }).then(function (users) {
                            if (users.length > 0) {
                                _this.users = users;
                                m.redraw();
                            } else {
                                _this.offset = _this.oldOffset;
                            }
                        });
                    }
                }, {
                    key: 'movePage',
                    value: function movePage(direction) {
                        this.oldOffset = this.offset;
                        this.offset = this.offset + direction * this.limit;

                        if (this.offset < 0) {
                            this.offset = 0;
                        }

                        this.queryList();
                    }
                }]);
                return GuardianPage;
            })(Component);

            _export('default', GuardianPage);
        }
    };
});;
System.register('hyn/guardian/components/GuardianUserDetailsPopup', ['flarum/components/Modal'], function (_export) {
    'use strict';

    var Modal, GuardianUserDetailsPopup;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal['default'];
        }],
        execute: function () {
            GuardianUserDetailsPopup = (function (_Modal) {
                babelHelpers.inherits(GuardianUserDetailsPopup, _Modal);

                function GuardianUserDetailsPopup() {
                    babelHelpers.classCallCheck(this, GuardianUserDetailsPopup);
                    babelHelpers.get(Object.getPrototypeOf(GuardianUserDetailsPopup.prototype), 'constructor', this).apply(this, arguments);
                }

                return GuardianUserDetailsPopup;
            })(Modal);

            _export('default', GuardianUserDetailsPopup);
        }
    };
});;
System.register('hyn/guardian/main', ['flarum/core/models/User', 'hyn/guardian/addGuardianPane'], function (_export) {
    'use strict';

    //import addTagsPermissionScope from 'flarum/tags/addTagsPermissionScope';
    //import addTagPermission from 'flarum/tags/addTagPermission';
    var User, addGuardianPane;
    return {
        setters: [function (_flarumCoreModelsUser) {
            User = _flarumCoreModelsUser['default'];
        }, function (_hynGuardianAddGuardianPane) {
            addGuardianPane = _hynGuardianAddGuardianPane['default'];
        }],
        execute: function () {

            app.initializers.add('hyn-guardian', function (app) {
                //addTagsPermissionScope();
                //addTagPermission();
                addGuardianPane();
            });
        }
    };
});