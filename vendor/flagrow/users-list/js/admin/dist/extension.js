'use strict';

System.register('flagrow/users-list/addUsersListPane', ['flarum/app', 'flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'flagrow/users-list/components/UsersListPage'], function (_export, _context) {
    "use strict";

    var app, extend, AdminNav, AdminLinkButton, UsersListPage;

    _export('default', function () {
        app.routes.usersList = { path: '/users-list', component: UsersListPage.component() };

        app.extensionSettings['flagrow-users-list'] = function () {
            return m.route(app.route('usersList'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            items.add('users-list', AdminLinkButton.component({
                href: app.route('usersList'),
                icon: 'users',
                children: app.translator.trans('flagrow-users-list.admin.nav.users_button'),
                description: app.translator.trans('flagrow-users-list.admin.nav.users_text')
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
        }, function (_flagrowUsersListComponentsUsersListPage) {
            UsersListPage = _flagrowUsersListComponentsUsersListPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/users-list/components/EmailUserModal', ['flarum/app', 'flarum/components/Modal', 'flarum/components/Button'], function (_export, _context) {
    "use strict";

    var app, Modal, Button, EmailUserModal;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }],
        execute: function () {
            EmailUserModal = function (_Modal) {
                babelHelpers.inherits(EmailUserModal, _Modal);

                function EmailUserModal() {
                    babelHelpers.classCallCheck(this, EmailUserModal);
                    return babelHelpers.possibleConstructorReturn(this, (EmailUserModal.__proto__ || Object.getPrototypeOf(EmailUserModal)).apply(this, arguments));
                }

                babelHelpers.createClass(EmailUserModal, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(EmailUserModal.prototype.__proto__ || Object.getPrototypeOf(EmailUserModal.prototype), 'init', this).call(this);

                        this.loading = false;

                        this.user = this.props.user;
                        this.forAll = this.props.forAll;
                        this.subject = m.prop(app.translator.trans('flagrow-users-list.admin.modal_mail.default_subject')[0]);
                        this.messageText = m.prop('');

                        if (!this.forAll) {
                            this.email = m.prop(this.user.email() || '');
                            this.submitDisabled = !this.checkEmail(this.email());
                        } else {
                            this.submitDisabled = false;
                        }
                    }
                }, {
                    key: 'className',
                    value: function className() {
                        return 'EmailUserModal Modal--large';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        var title = app.translator.trans('flagrow-users-list.admin.modal_mail.title_text');
                        if (this.forAll) {
                            title += ' ' + app.translator.trans('flagrow-users-list.admin.modal_mail.title_all_text');
                        } else {
                            title += ' ' + this.user.username() + ' (' + this.email() + ')';
                        }
                        return title;
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        return [m('div', { className: 'Modal-body' }, [m('form', {
                            className: 'Form',
                            onsubmit: this.onsubmit.bind(this)
                        }, [this.forAll ? '' : m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('flagrow-users-list.admin.modal_mail.email_label')), m('input', {
                            className: 'FormControl',
                            value: this.email(),
                            oninput: m.withAttr('value', this.oninputEmail.bind(this))
                        })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('flagrow-users-list.admin.modal_mail.subject_label')), m('input', {
                            className: 'FormControl',
                            value: this.subject(),
                            oninput: m.withAttr('value', this.subject)
                        })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('flagrow-users-list.admin.modal_mail.message_label')), m('textarea', {
                            className: 'FormControl',
                            rows: 10,
                            style: "resize: vertical;",
                            value: this.messageText(),
                            oninput: m.withAttr('value', this.messageText)
                        })]), Button.component({
                            type: 'submit',
                            className: 'Button Button--primary EditContactModal-save',
                            loading: this.loading,
                            children: app.translator.trans('flagrow-users-list.admin.modal_mail.submit_button'),
                            disabled: this.submitDisabled
                        })])])];
                    }
                }, {
                    key: 'oninputEmail',
                    value: function oninputEmail(value) {
                        this.email(value);
                        this.submitDisabled = !this.checkEmail(value);
                    }
                }, {
                    key: 'checkEmail',
                    value: function checkEmail(email) {
                        var emailRegexp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

                        var correct = true;
                        var emails = this.splitEmails(email);
                        emails.forEach(function (email) {
                            if (!emailRegexp.test(email)) {
                                correct = false;
                            }
                        });
                        return correct;
                    }
                }, {
                    key: 'splitEmails',
                    value: function splitEmails(email) {
                        email = email.replace(/\s*/g, '');
                        return email.split(',');
                    }
                }, {
                    key: 'onsubmit',
                    value: function onsubmit(e) {
                        var _this2 = this;

                        e.preventDefault();

                        this.loading = true;

                        var data = {
                            emails: this.forAll ? [] : this.splitEmails(this.email()),
                            subject: this.subject(),
                            text: this.messageText(),
                            forAll: this.forAll
                        };

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/admin-mail',
                            data: { data: data }
                        }).then(function () {
                            _this2.hide();
                        }, function (response) {
                            _this2.loading = false;
                            _this2.onerror(response);
                        });
                    }
                }]);
                return EmailUserModal;
            }(Modal);

            _export('default', EmailUserModal);
        }
    };
});;
'use strict';

System.register('flarum/components/EditUserModal', ['flarum/components/Modal', 'flarum/components/Button', 'flarum/components/GroupBadge', 'flarum/models/Group', 'flarum/utils/extractText'], function (_export, _context) {
  "use strict";

  var Modal, Button, GroupBadge, Group, extractText, EditUserModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumComponentsGroupBadge) {
      GroupBadge = _flarumComponentsGroupBadge.default;
    }, function (_flarumModelsGroup) {
      Group = _flarumModelsGroup.default;
    }, function (_flarumUtilsExtractText) {
      extractText = _flarumUtilsExtractText.default;
    }],
    execute: function () {
      EditUserModal = function (_Modal) {
        babelHelpers.inherits(EditUserModal, _Modal);

        function EditUserModal() {
          babelHelpers.classCallCheck(this, EditUserModal);
          return babelHelpers.possibleConstructorReturn(this, (EditUserModal.__proto__ || Object.getPrototypeOf(EditUserModal)).apply(this, arguments));
        }

        babelHelpers.createClass(EditUserModal, [{
          key: 'init',
          value: function init() {
            var _this2 = this;

            babelHelpers.get(EditUserModal.prototype.__proto__ || Object.getPrototypeOf(EditUserModal.prototype), 'init', this).call(this);

            var user = this.props.user;

            this.username = m.prop(user.username() || '');
            this.email = m.prop(user.email() || '');
            this.isActivated = m.prop(user.isActivated() || false);
            this.setPassword = m.prop(false);
            this.password = m.prop(user.password() || '');
            this.groups = {};

            app.store.all('groups').filter(function (group) {
              return [Group.GUEST_ID, Group.MEMBER_ID].indexOf(group.id()) === -1;
            }).forEach(function (group) {
              return _this2.groups[group.id()] = m.prop(user.groups().indexOf(group) !== -1);
            });
          }
        }, {
          key: 'className',
          value: function className() {
            return 'EditUserModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('flagrow-users-list.admin.modal_user.title');
          }
        }, {
          key: 'content',
          value: function content() {
            var _this3 = this;

            return m(
              'div',
              { className: 'Modal-body' },
              m(
                'div',
                { className: 'Form' },
                m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    'label',
                    null,
                    app.translator.trans('flagrow-users-list.admin.modal_user.username_heading')
                  ),
                  m('input', { className: 'FormControl', placeholder: extractText(app.translator.trans('flagrow-users-list.admin.modal_user.username_label')),
                    bidi: this.username })
                ),
                app.session.user !== this.props.user ? [m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    'label',
                    null,
                    app.translator.trans('flagrow-users-list.admin.modal_user.email_heading')
                  ),
                  m(
                    'div',
                    null,
                    m('input', { className: 'FormControl', placeholder: extractText(app.translator.trans('flagrow-users-list.admin.modal_user.email_label')),
                      bidi: this.email })
                  ),
                  !this.isActivated() ? m(
                    'div',
                    null,
                    Button.component({
                      className: 'Button Button--block',
                      children: app.translator.trans('flagrow-users-list.admin.modal_user.activate_button'),
                      loading: this.loading,
                      onclick: this.activate.bind(this)
                    })
                  ) : ''
                ), m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    'label',
                    null,
                    app.translator.trans('flagrow-users-list.admin.modal_user.password_heading')
                  ),
                  m(
                    'div',
                    null,
                    m(
                      'label',
                      { className: 'checkbox' },
                      m('input', { type: 'checkbox', checked: this.setPassword(), onchange: function onchange(e) {
                          _this3.setPassword(e.target.checked);
                          m.redraw(true);
                          if (e.target.checked) _this3.$('[name=password]').select();
                          m.redraw.strategy('none');
                        } }),
                      app.translator.trans('flagrow-users-list.admin.modal_user.set_password_label')
                    ),
                    this.setPassword() ? m('input', { className: 'FormControl', type: 'password', name: 'password', placeholder: extractText(app.translator.trans('flagrow-users-list.admin.modal_user.password_label')),
                      bidi: this.password }) : ''
                  )
                )] : '',
                m(
                  'div',
                  { className: 'Form-group EditUserModal-groups' },
                  m(
                    'label',
                    null,
                    app.translator.trans('flagrow-users-list.admin.modal_user.groups_heading')
                  ),
                  m(
                    'div',
                    null,
                    Object.keys(this.groups).map(function (id) {
                      return app.store.getById('groups', id);
                    }).map(function (group) {
                      return m(
                        'label',
                        { className: 'checkbox' },
                        m('input', { type: 'checkbox',
                          bidi: _this3.groups[group.id()],
                          disabled: _this3.props.user.id() === '1' && group.id() === Group.ADMINISTRATOR_ID }),
                        GroupBadge.component({ group: group, label: '' }),
                        ' ',
                        group.nameSingular()
                      );
                    })
                  )
                ),
                m(
                  'div',
                  { className: 'Form-group' },
                  Button.component({
                    className: 'Button Button--primary',
                    type: 'submit',
                    loading: this.loading,
                    children: app.translator.trans('flagrow-users-list.admin.modal_user.submit_button')
                  })
                )
              )
            );
          }
        }, {
          key: 'activate',
          value: function activate() {
            var _this4 = this;

            this.loading = true;
            var data = {
              username: this.username(),
              isActivated: true
            };
            this.props.user.save(data, { errorHandler: this.onerror.bind(this) }).then(function () {
              _this4.isActivated(true);
              _this4.loading = false;
              m.redraw();
            }).catch(function () {
              _this4.loading = false;
              m.redraw();
            });
          }
        }, {
          key: 'data',
          value: function data() {
            var _this5 = this;

            var groups = Object.keys(this.groups).filter(function (id) {
              return _this5.groups[id]();
            }).map(function (id) {
              return app.store.getById('groups', id);
            });

            var data = {
              username: this.username(),
              relationships: { groups: groups }
            };

            if (app.session.user !== this.props.user) {
              data.email = this.email();
            }

            if (this.setPassword()) {
              data.password = this.password();
            }

            return data;
          }
        }, {
          key: 'onsubmit',
          value: function onsubmit(e) {
            var _this6 = this;

            e.preventDefault();

            this.loading = true;

            this.props.user.save(this.data(), { errorHandler: this.onerror.bind(this) }).then(this.hide.bind(this)).catch(function () {
              _this6.loading = false;
              m.redraw();
            });
          }
        }]);
        return EditUserModal;
      }(Modal);

      _export('default', EditUserModal);
    }
  };
});;
'use strict';

System.register('flagrow/users-list/components/UsersListPage', ['flarum/app', 'flarum/components/Page', 'flarum/components/Button', 'flarum/components/LoadingIndicator', 'flarum/helpers/humanTime', 'flarum/helpers/icon', 'flarum/components/EditUserModal', 'flagrow/users-list/components/EmailUserModal'], function (_export, _context) {
    "use strict";

    var app, Page, Button, LoadingIndicator, humanTime, icon, EmailUserModal, UsersListPage, EditUserModal;

    function UserItem(user) {
        var url = app.forum.attribute('baseUrl') + '/u/' + user.id();
        var online = user.isOnline();

        return [m('li', { "data-id": user.id() }, [m('div', { className: 'UsersListItem-info' }, [m('span', { className: 'badges' }, user.badges().toArray()), m('span', { className: 'UsersListItem-name' }, [user.username()]), m('span', { className: 'UsersListItem-comments' }, [user.isActivated() ? icon('check') : icon('close')]), m('span', { className: 'UserCard-lastSeen jointime' }, [icon('calendar-o'), ' ', humanTime(user.joinTime())]), m('span', { className: 'UserCard-lastSeen' + (online ? ' online' : ' ') }, [online ? [icon('circle'), ' ', app.translator.trans('flagrow-users-list.admin.page.online_text')] : [icon('clock-o'), ' ', humanTime(user.lastSeenTime())]]), m('span', { className: 'UsersListItem-comments' }, [icon('comment-o'),' ', user.commentsCount()]), m('span', { className: 'UsersListItem-discussions' }, [icon('reorder'),' ', user.discussionsCount()]), m('a', {
            className: 'Button Button--link',
            target: '_blank',
            href: url
        }, [icon('eye')]), Button.component({
            className: 'Button Button--link',
            icon: 'envelope',
            onclick: function onclick(e) {
                e.preventDefault();
                app.modal.show(new EmailUserModal({ user: user }));
            }
        }),Button.component({
            className: 'Button Button--link',
            icon: 'pencil',
		onclick: function onclick() {
                return app.modal.show(new EditUserModal({ user: user }));
              }
        })
	])])];
    }

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsLoadingIndicator) {
            LoadingIndicator = _flarumComponentsLoadingIndicator.default;
        }, function (_flarumHelpersHumanTime) {
            humanTime = _flarumHelpersHumanTime.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
	}, function (_flarumComponentsEditUserModal) {
            EditUserModal = _flarumComponentsEditUserModal.default;
        }, function (_flagrowUsersListComponentsEmailUserModal) {
            EmailUserModal = _flagrowUsersListComponentsEmailUserModal.default;
        }],
        execute: function () {
            UsersListPage = function (_Page) {
                babelHelpers.inherits(UsersListPage, _Page);

                function UsersListPage() {
                    babelHelpers.classCallCheck(this, UsersListPage);
                    return babelHelpers.possibleConstructorReturn(this, (UsersListPage.__proto__ || Object.getPrototypeOf(UsersListPage)).apply(this, arguments));
                }

                babelHelpers.createClass(UsersListPage, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(UsersListPage.prototype.__proto__ || Object.getPrototypeOf(UsersListPage.prototype), 'init', this).call(this);

                        this.loading = true;
                        this.moreResults = false;
                        this.users = [];
                        this.refresh();
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var loading = void 0;

                        if (this.loading) {
                            loading = LoadingIndicator.component();
                        } else if (this.moreResults) {
                            loading = Button.component({
                                children: app.translator.trans('flagrow-users-list.admin.page.load_more_button'),
                                className: 'Button',
                                onclick: this.loadMore.bind(this)
                            });
                        }

                        return [m('div', { className: 'UsersListPage' }, [m('div', { className: 'UsersListPage-header' }, [m('div', { className: 'container' }, [m('p', {}, app.translator.trans('flagrow-users-list.admin.page.about_text')), Button.component({
                            className: 'Button Button--primary',
                            icon: 'plus',
                            children: app.translator.trans('flagrow-users-list.admin.page.mail_all_button'),
                            onclick: function onclick() {
                                return app.modal.show(new EmailUserModal({ 'forAll': true }));
                            }
                        })])]), m('div', { className: 'UsersListPage-list' }, [m('div', { className: 'container' }, [m('div', { className: 'UsersListItems' }, [m('label', {}, app.translator.trans('flagrow-users-list.admin.page.list_title')), m('ol', {
                            className: 'UsersList'
                        }, [this.users.map(UserItem)]), m('div', { className: 'UsersListPage-loadMore' }, [loading])])])])])];
                    }
                }, {
                    key: 'refresh',
                    value: function refresh() {
                        var _this2 = this;

                        var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

                        if (clear) {
                            this.loading = true;
                            this.users = [];
                        }

                        return this.loadResults().then(function (results) {
                            _this2.users = [];
                            _this2.parseResults(results);
                        }, function () {
                            _this2.loading = false;
                            m.redraw();
                        });
                    }
                }, {
                    key: 'loadResults',
                    value: function loadResults(offset) {
                        var params = {};
                        params.page = {
                            offset: offset,
                            limit: 50
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
                return UsersListPage;
            }(Page);

            _export('default', UsersListPage);
        }
    };
});;
'use strict';

System.register('flagrow/users-list/main', ['flarum/app', 'flagrow/users-list/addUsersListPane'], function (_export, _context) {
    "use strict";

    var app, addUsersListPane;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flagrowUsersListAddUsersListPane) {
            addUsersListPane = _flagrowUsersListAddUsersListPane.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-users-list', function (app) {
                addUsersListPane();
            });
        }
    };
});
