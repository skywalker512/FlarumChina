'use strict';

System.register('avatar4eg/users-list/addUsersListPane', ['flarum/app', 'flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'avatar4eg/users-list/components/UsersListPage'], function (_export, _context) {
    "use strict";

    var app, extend, AdminNav, AdminLinkButton, CountriesPage;

    _export('default', function () {
        app.routes.usersList = { path: '/users-list', component: CountriesPage.component() };

        app.extensionSettings['avatar4eg-users-list'] = function () {
            return m.route(app.route('usersList'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            items.add('users-list', AdminLinkButton.component({
                href: app.route('usersList'),
                icon: 'users',
                children: app.translator.trans('avatar4eg-users-list.admin.nav.users_button'),
                description: app.translator.trans('avatar4eg-users-list.admin.nav.users_text')
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
        }, function (_avatar4egUsersListComponentsUsersListPage) {
            CountriesPage = _avatar4egUsersListComponentsUsersListPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('avatar4eg/users-list/components/EmailUserModal', ['flarum/app', 'flarum/components/Modal', 'flarum/components/Button'], function (_export, _context) {
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
                        this.subject = m.prop(app.translator.trans('avatar4eg-users-list.admin.modal_mail.default_subject')[0]);
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
                        var title = app.translator.trans('avatar4eg-users-list.admin.modal_mail.title_text');
                        if (this.forAll) {
                            title += ' ' + app.translator.trans('avatar4eg-users-list.admin.modal_mail.title_all_text');
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
                        }, [this.forAll ? '' : m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-users-list.admin.modal_mail.email_label')), m('input', {
                            className: 'FormControl',
                            value: this.email(),
                            oninput: m.withAttr('value', this.oninputEmail.bind(this))
                        })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-users-list.admin.modal_mail.subject_label')), m('input', {
                            className: 'FormControl',
                            value: this.subject(),
                            oninput: m.withAttr('value', this.subject)
                        })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-users-list.admin.modal_mail.message_label')), m('textarea', {
                            className: 'FormControl',
                            rows: 10,
                            style: "resize: vertical;",
                            value: this.messageText(),
                            oninput: m.withAttr('value', this.messageText)
                        })]), Button.component({
                            type: 'submit',
                            className: 'Button Button--primary EditContactModal-save',
                            loading: this.loading,
                            children: app.translator.trans('avatar4eg-users-list.admin.modal_mail.submit_button'),
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
                            _this2.handleErrors(response);
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

System.register('avatar4eg/users-list/components/UsersListPage', ['flarum/app', 'flarum/components/Page', 'flarum/components/Button', 'flarum/components/LoadingIndicator', 'flarum/helpers/humanTime', 'flarum/helpers/icon', 'avatar4eg/users-list/components/EmailUserModal'], function (_export, _context) {
    "use strict";

    var app, Page, Button, LoadingIndicator, humanTime, icon, EmailUserModal, UsersListPage;


    function UserItem(user) {
        var url = app.forum.attribute('baseUrl') + '/u/' + user.id();
        var online = user.isOnline();

        return [m('li', { "data-id": user.id() }, [m('div', { className: 'UsersListItem-info' }, [m('span', { className: 'UsersListItem-name' }, [user.username()]), m('span', { className: 'UserCard-lastSeen' + (online ? ' online' : '') }, [online ? [icon('circle'), ' ', app.translator.trans('avatar4eg-users-list.admin.page.online_text')] : [icon('clock-o'), ' ', humanTime(user.lastSeenTime())]]), m('span', { className: 'UsersListItem-comments' }, [icon('comment-o'), user.commentsCount()]), m('span', { className: 'UsersListItem-discussions' }, [icon('reorder'), user.discussionsCount()]), m('a', {
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
        })])])];
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
        }, function (_avatar4egUsersListComponentsEmailUserModal) {
            EmailUserModal = _avatar4egUsersListComponentsEmailUserModal.default;
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
                                children: app.translator.trans('avatar4eg-users-list.admin.page.load_more_button'),
                                className: 'Button',
                                onclick: this.loadMore.bind(this)
                            });
                        }

                        return [m('div', { className: 'UsersListPage' }, [m('div', { className: 'UsersListPage-header' }, [m('div', { className: 'container' }, [m('p', {}, app.translator.trans('avatar4eg-users-list.admin.page.about_text')), Button.component({
                            className: 'Button Button--primary',
                            icon: 'plus',
                            children: app.translator.trans('avatar4eg-users-list.admin.page.mail_all_button'),
                            onclick: function onclick() {
                                return app.modal.show(new EmailUserModal({ 'forAll': true }));
                            }
                        })])]), m('div', { className: 'UsersListPage-list' }, [m('div', { className: 'container' }, [m('div', { className: 'UsersListItems' }, [m('label', {}, app.translator.trans('avatar4eg-users-list.admin.page.list_title')), m('ol', {
                            className: 'UsersList'
                        }, [this.users.map(UserItem)]), m('div', { className: 'UsersListPage-loadMore' }, [loading])])])])])];
                    }
                }, {
                    key: 'refresh',
                    value: function refresh() {
                        var _this2 = this;

                        var clear = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

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

System.register('avatar4eg/users-list/main', ['flarum/app', 'avatar4eg/users-list/addUsersListPane'], function (_export, _context) {
    "use strict";

    var app, addUsersListPane;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_avatar4egUsersListAddUsersListPane) {
            addUsersListPane = _avatar4egUsersListAddUsersListPane.default;
        }],
        execute: function () {

            app.initializers.add('avatar4eg-users-list', function (app) {
                addUsersListPane();
            });
        }
    };
});