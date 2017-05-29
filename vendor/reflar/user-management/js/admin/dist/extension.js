'use strict';

System.register('Reflar/UserManagement/addMembersListPane', ['flarum/app', 'flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'Reflar/UserManagement/components/MemberPage'], function (_export, _context) {
    "use strict";

    var app, extend, AdminNav, AdminLinkButton, MemberPage;

    _export('default', function () {
        app.routes.members = { path: '/members', component: MemberPage.component() };

        app.extensionSettings['reflar-user-management'] = function () {
            return m.route(app.route('members'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            items.add('members', AdminLinkButton.component({
                href: app.route('members'),
                icon: 'address-book-o',
                children: app.translator.trans('reflar-usermanagement.admin.nav.title'),
                description: app.translator.trans('reflar-usermanagement.admin.nav.desc')
            }));
        });
    });

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_ReflarUserManagementComponentsMemberPage) {
            MemberPage = _ReflarUserManagementComponentsMemberPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('Reflar/UserManagement/components/AdminStrikeModal', ['flarum/components/Modal', 'flarum/components/Button', 'flarum/helpers/humanTime', 'flarum/components/FieldSet'], function (_export, _context) {
  "use strict";

  var Modal, Button, humanTime, FieldSet, AdminStrikeModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumHelpersHumanTime) {
      humanTime = _flarumHelpersHumanTime.default;
    }, function (_flarumComponentsFieldSet) {
      FieldSet = _flarumComponentsFieldSet.default;
    }],
    execute: function () {
      AdminStrikeModal = function (_Modal) {
        babelHelpers.inherits(AdminStrikeModal, _Modal);

        function AdminStrikeModal() {
          babelHelpers.classCallCheck(this, AdminStrikeModal);
          return babelHelpers.possibleConstructorReturn(this, (AdminStrikeModal.__proto__ || Object.getPrototypeOf(AdminStrikeModal)).apply(this, arguments));
        }

        babelHelpers.createClass(AdminStrikeModal, [{
          key: 'init',
          value: function init() {
            var _this2 = this;

            babelHelpers.get(AdminStrikeModal.prototype.__proto__ || Object.getPrototypeOf(AdminStrikeModal.prototype), 'init', this).call(this);

            this.user = this.props.user;

            app.request({
              method: 'GET',
              url: app.forum.attribute('apiUrl') + '/strike/' + this.user.data.id
            }).then(function (response) {
              _this2.strikes = response.data;
              _this2.flatstrikes = [];
              for (i = 0; i < _this2.strikes.length; i++) {
                _this2.flatstrikes[i] = [];
                _this2.flatstrikes[i]['index'] = i + 1;
                _this2.flatstrikes[i]['id'] = _this2.strikes[i].attributes['id'];
                _this2.flatstrikes[i]['actor'] = _this2.strikes[i].attributes['actor'];
                _this2.flatstrikes[i]['reason'] = _this2.strikes[i].attributes['reason'];
                _this2.flatstrikes[i]['post'] = _this2.strikes[i].attributes['post'];
                _this2.flatstrikes[i]['time'] = new Date(_this2.strikes[i].attributes['time']);
              }
              if (_this2.strikes.length == 0) {
                _this2.strikes = undefined;
              }
              m.redraw();
              _this2.loading = false;
            });
          }
        }, {
          key: 'className',
          value: function className() {
            if (this.strikes !== undefined) {
              return 'AdminStrikeModal Modal';
            } else {
              return 'NoStrikeModal Modal Modal--small';
            }
          }
        }, {
          key: 'title',
          value: function title() {
            var username = this.user.data.attributes.username;
            return app.translator.trans('reflar-usermanagement.admin.modal.view.title', { username: username });
          }
        }, {
          key: 'content',
          value: function content() {
            var _this3 = this;

            return m('div', { className: 'Modal-body' }, [m('div', { className: 'Form Form--centered' }, [FieldSet.component({
              className: 'AdminStrikeModal--fieldset',
              children: [this.strikes !== undefined ? m('table', { className: "NotificationGrid" }, [m('thead', [m('tr', [m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.number')]), m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.reason')]), m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.content')]), m('td', { className: "HideOnMobile" }, [app.translator.trans('reflar-usermanagement.admin.modal.view.actor')]), m('td', { className: "HideOnMobile" }, [app.translator.trans('reflar-usermanagement.admin.modal.view.time')]), m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.remove')])])]), m('tbody', [this.flatstrikes.map(function (strike) {
                return [m('tr', [m('td', [strike['index']]), m('td', [strike['reason']]), m('td', [m('a', { target: "_blank", href: app.forum.attribute('baseUrl') + '/d/' + strike['post'] }, [app.translator.trans('reflar-usermanagement.admin.modal.view.link')])]), m('td', { className: "HideOnMobile" }, [m('a', { target: "_blank", href: app.forum.attribute('baseUrl') + '/u/' + strike['actor'] }, [strike['actor']])]), m('td', { className: "HideOnMobile" }, [humanTime(strike['time'])]), m('td', [m('a', { className: "icon fa fa-fw fa-times", onclick: function onclick() {
                    _this3.deleteStrike(strike['id'], strike['index']);
                  } })])])];
              })])]) : m('tr', [m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.no_strikes')])])] })])]);
          }
        }, {
          key: 'deleteStrike',
          value: function deleteStrike(id, index) {

            if (this.loading) return;

            this.loading = true;

            app.request({
              method: 'Delete',
              url: app.forum.attribute('apiUrl') + '/strike/' + id
            }).then(this.flatstrikes.splice(index - 1, 1));
          }
        }]);
        return AdminStrikeModal;
      }(Modal);

      _export('default', AdminStrikeModal);
    }
  };
});;
'use strict';

System.register('Reflar/UserManagement/components/MemberPage', ['flarum/app', 'flarum/components/Alert', 'flarum/components/Page', 'flarum/components/Button', 'flarum/components/LoadingIndicator', 'flarum/helpers/humanTime', 'flarum/components/Switch', 'flarum/helpers/icon', 'flarum/utils/saveSettings', 'Reflar/UserManagement/components/AdminStrikeModal'], function (_export, _context) {
    "use strict";

    var app, Alert, Page, Button, LoadingIndicator, humanTime, Switch, icon, saveSettings, AdminStrikeModal, MemberPage;


    function MemberItem(user) {
        var url = app.forum.attribute('baseUrl') + '/u/' + user.id();
        var online = user.isOnline();
        var activated = user.isActivated();

        return [m('li', { "data-id": user.id() }, [m('div', { className: 'MemberListItem-info' }, [m('span', { className: 'MemberListItem-name' }, [user.username()]), m('div', { className: 'MemberListItem-info' + (activated ? '1' : '0') }, [activated ? [m('span', { className: 'MemberCard-lastSeen' + (online ? ' online' : '') }, [online ? [{ className: 'MemberCard-online' }, icon('circle'), ' ', app.translator.trans('reflar-usermanagement.admin.page.online_text')] : [icon('clock-o'), ' ', humanTime(user.lastSeenTime())]])] : [m('span', { className: 'MemberCard-lastSeen' }, [m('a', {
            className: 'Button Button--link',
            onclick: function onclick() {
                app.request({
                    url: app.forum.attribute('apiUrl') + '/reflar/usermanagement/attributes',
                    method: 'POST',
                    data: { username: user.username() }
                }).then(function () {
                    return window.location.reload();
                });
            }
        }, [app.translator.trans('reflar-usermanagement.admin.page.activate')])])]]), m('span', { className: 'MemberListItem-comments' }, [icon('comment-o'), user.commentsCount()]), m('span', { className: 'MemberListItem-discussions' }, [icon('reorder'), user.discussionsCount()]), Button.component({
            className: 'Button Button--link',
            icon: 'exclamation-triangle',
            onclick: function onclick(e) {
                app.modal.show(new AdminStrikeModal({ user: user }));
                m.redraw();
            }
        }), m('a', {
            className: 'Button Button--link',
            target: '_blank',
            href: url
        }, [icon('eye')])])])];
    }

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsAlert) {
            Alert = _flarumComponentsAlert.default;
        }, function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsLoadingIndicator) {
            LoadingIndicator = _flarumComponentsLoadingIndicator.default;
        }, function (_flarumHelpersHumanTime) {
            humanTime = _flarumHelpersHumanTime.default;
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }, function (_ReflarUserManagementComponentsAdminStrikeModal) {
            AdminStrikeModal = _ReflarUserManagementComponentsAdminStrikeModal.default;
        }],
        execute: function () {
            MemberPage = function (_Page) {
                babelHelpers.inherits(MemberPage, _Page);

                function MemberPage() {
                    babelHelpers.classCallCheck(this, MemberPage);
                    return babelHelpers.possibleConstructorReturn(this, (MemberPage.__proto__ || Object.getPrototypeOf(MemberPage)).apply(this, arguments));
                }

                babelHelpers.createClass(MemberPage, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(MemberPage.prototype.__proto__ || Object.getPrototypeOf(MemberPage.prototype), 'init', this).call(this);

                        var settings = app.data.settings;

                        this.loading = true;
                        this.moreResults = false;
                        this.users = [];
                        this.refresh();

                        this.genderRegEnabled = m.prop(settings['Reflar-genderRegEnabled'] === '1');
                        this.ageRegEnabled = m.prop(settings['Reflar-ageRegEnabled'] === '1');
                        this.emailRegEnabled = m.prop(settings['Reflar-emailRegEnabled'] === '1');
                        this.recaptcha = m.prop(settings['Reflar-recaptcha'] === '1');
                        this.amountPerPage = m.prop(settings['ReFlar-amountPerPage'] || 25);
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var _this2 = this;

                        var loading = void 0;

                        if (this.loading) {
                            loading = LoadingIndicator.component();
                        } else if (this.moreResults) {
                            loading = Button.component({
                                children: app.translator.trans('reflar-usermanagement.admin.page.load_more_button'),
                                className: 'Button',
                                onclick: this.loadMore.bind(this)
                            });
                        }
                        console.log(this.users);
                        return [m('div', { className: 'MemberListPage' }, [m('div', { className: 'MemberList-header' }, [m('div', { className: 'container' }, [m('p', {}, app.translator.trans('reflar-usermanagement.admin.page.about_text')), m(
                            'div',
                            { className: 'Form-group' },
                            Switch.component({
                                className: "SettingsModal-switch",
                                state: this.emailRegEnabled(),
                                children: app.translator.trans('reflar-usermanagement.admin.modal.email_switch'),
                                onchange: this.emailRegEnabled
                            })
                        ), m(
                            'div',
                            { className: 'Form-group' },
                            Switch.component({
                                className: "SettingsModal-switch",
                                state: this.genderRegEnabled(),
                                children: app.translator.trans('reflar-usermanagement.admin.modal.gender_label'),
                                onchange: this.genderRegEnabled
                            })
                        ), m(
                            'div',
                            { className: 'Form-group' },
                            Switch.component({
                                className: "SettingsModal-switch",
                                state: this.ageRegEnabled(),
                                children: app.translator.trans('reflar-usermanagement.admin.modal.age_label'),
                                onchange: this.ageRegEnabled
                            })
                        ), m(
                            'div',
                            { className: 'Form-group' },
                            Switch.component({
                                className: "SettingsModal-switch",
                                state: this.recaptcha(),
                                children: app.translator.trans('reflar-usermanagement.admin.modal.recaptcha'),
                                onchange: this.recaptcha
                            })
                        ), m(
                            'div',
                            { className: 'Form-group' },
                            m(
                                'label',
                                null,
                                app.translator.trans('reflar-usermanagement.admin.modal.amount_label')
                            ),
                            m('input', { className: 'FormControl', type: 'number', value: this.amountPerPage(), onchange: m.withAttr('value', this.amountPerPage) })
                        ), Button.component({
                            className: 'Button Button--primary',
                            icon: 'plus',
                            children: app.translator.trans('core.admin.appearance.submit_button'),
                            onclick: function onclick() {

                                if (_this2.loading) return;

                                _this2.loading = true;

                                saveSettings({
                                    'Reflar-genderRegEnabled': _this2.genderRegEnabled(),
                                    'Reflar-ageRegEnabled': _this2.ageRegEnabled(),
                                    'Reflar-emailRegEnabled': _this2.emailRegEnabled(),
                                    'Reflar-recaptcha': _this2.recaptcha(),
                                    'ReFlar-amountPerPage': _this2.amountPerPage()
                                }).then(function () {
                                    app.alerts.show(_this2.successAlert = new Alert({
                                        type: 'success',
                                        children: app.translator.trans('core.admin.basics.saved_message')
                                    }));
                                }).then(function () {
                                    _this2.loading = false;
                                    window.location.reload();
                                });
                            }
                        })])]), m('div', { className: 'MemberList-list' }, [m('div', { className: 'container' }, [m('div', { className: 'MemberListItems' }, [m('label', { className: 'MemberListLabel' }, app.translator.trans('reflar-usermanagement.admin.page.list_title')), m('ol', {
                            className: 'MemberList'
                        }, [this.users.map(MemberItem)]), m('div', { className: 'MemberList-loadMore' }, [loading])])])])])];
                    }
                }, {
                    key: 'refresh',
                    value: function refresh() {
                        var _this3 = this;

                        var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

                        if (clear) {
                            this.loading = true;
                            this.users = [];
                        }

                        return this.loadResults().then(function (results) {
                            _this3.users = [];
                            _this3.parseResults(results);
                        }, function () {
                            _this3.loading = false;
                            m.redraw();
                        });
                    }
                }, {
                    key: 'loadResults',
                    value: function loadResults(offset) {
                        var params = {};
                        params.page = {
                            offset: offset,
                            limit: app.data.settings['ReFlar-amountPerPage']
                        };
                        params.sort = 'username';

                        return app.store.find('users', params);
                    }
                }, {
                    key: 'loadMore',
                    value: function loadMore() {
                        this.loading = true;

                        this.loadResults(this.users.length).then(this.parseResults.bind(this));
                    }
                }, {
                    key: 'parseResults',
                    value: function parseResults(results) {
                        [].push.apply(this.users, results);

                        this.loading = false;
                        this.moreResults = !!results.payload.links.next;

                        m.lazyRedraw();

                        return results;
                    }
                }]);
                return MemberPage;
            }(Page);

            _export('default', MemberPage);
        }
    };
});;
'use strict';

System.register('Reflar/UserManagement/main', ['flarum/extend', 'Reflar/UserManagement/addMembersListPane', 'flarum/components/PermissionGrid'], function (_export, _context) {
  "use strict";

  var extend, addMembersListPane, PermissionGrid;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_ReflarUserManagementAddMembersListPane) {
      addMembersListPane = _ReflarUserManagementAddMembersListPane.default;
    }, function (_flarumComponentsPermissionGrid) {
      PermissionGrid = _flarumComponentsPermissionGrid.default;
    }],
    execute: function () {

      app.initializers.add('Reflar-User-Management', function (app) {
        addMembersListPane();

        extend(PermissionGrid.prototype, 'moderateItems', function (items) {
          items.add('activate', {
            icon: 'address-card-o',
            label: app.translator.trans('reflar-usermanagement.admin.activate_perm_item'),
            permission: 'user.activate'
          });
          items.add('strike', {
            icon: 'times',
            label: app.translator.trans('reflar-usermanagement.admin.strike_perm_item'),
            permission: 'discussion.strike'
          });
          items.add('viewStrikes', {
            icon: 'eye',
            label: app.translator.trans('reflar-usermanagement.admin.viewstrike_perm_item'),
            permission: 'user.strike'
          });
        });
      });
    }
  };
});