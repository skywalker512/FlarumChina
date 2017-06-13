'use strict';

System.register('flagrow/masquerade/addProfileConfigurePane', ['flarum/extend', 'flagrow/masquerade/panes/ProfileConfigurePane', 'flarum/components/UserPage', 'flarum/components/LinkButton'], function (_export, _context) {
    "use strict";

    var extend, ProfileConfigurePane, UserPage, LinkButton;

    _export('default', function () {
        // create the route
        app.routes['masquerade-configure-profile'] = { path: '/masquerade/configure', component: ProfileConfigurePane.component() };

        extend(UserPage.prototype, 'navItems', function (items) {
            if (app.forum.attribute('canHaveMasquerade') && app.session.user === this.user) {
                items.add('masquerade-configure', LinkButton.component({
                    href: app.route('masquerade-configure-profile'),
                    children: app.translator.trans('flagrow-masquerade.forum.buttons.configure-profile'),
                    icon: 'id-card-o'
                }), -100);
            }
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flagrowMasqueradePanesProfileConfigurePane) {
            ProfileConfigurePane = _flagrowMasqueradePanesProfileConfigurePane.default;
        }, function (_flarumComponentsUserPage) {
            UserPage = _flarumComponentsUserPage.default;
        }, function (_flarumComponentsLinkButton) {
            LinkButton = _flarumComponentsLinkButton.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/masquerade/addProfilePane', ['flarum/extend', 'flagrow/masquerade/panes/ProfilePane', 'flarum/components/UserPage', 'flarum/components/LinkButton'], function (_export, _context) {
    "use strict";

    var extend, ProfilePane, UserPage, LinkButton;

    _export('default', function () {
        // create the route
        app.routes['flagrow-masquerade-view-profile'] = { path: '/masquerade/:username', component: ProfilePane.component() };

        extend(UserPage.prototype, 'navItems', function (items) {
            if (app.forum.attribute('canViewMasquerade')) {
                var user = this.user;
                items.add('masquerade', LinkButton.component({
                    href: app.route('flagrow-masquerade-view-profile', { username: user.username() }),
                    children: app.translator.trans('flagrow-masquerade.forum.buttons.view-profile'),
                    icon: 'id-card-o'
                }), 200);
            }
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flagrowMasqueradePanesProfilePane) {
            ProfilePane = _flagrowMasqueradePanesProfilePane.default;
        }, function (_flarumComponentsUserPage) {
            UserPage = _flarumComponentsUserPage.default;
        }, function (_flarumComponentsLinkButton) {
            LinkButton = _flarumComponentsLinkButton.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("flagrow/masquerade/main", ["flarum/extend", "flarum/app", "flagrow/masquerade/models/Field", "flagrow/masquerade/models/Answer", "flagrow/masquerade/addProfileConfigurePane", "flagrow/masquerade/addProfilePane"], function (_export, _context) {
    "use strict";

    var extend, app, Field, Answer, addProfileConfigurePane, addProfilePane;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flagrowMasqueradeModelsField) {
            Field = _flagrowMasqueradeModelsField.default;
        }, function (_flagrowMasqueradeModelsAnswer) {
            Answer = _flagrowMasqueradeModelsAnswer.default;
        }, function (_flagrowMasqueradeAddProfileConfigurePane) {
            addProfileConfigurePane = _flagrowMasqueradeAddProfileConfigurePane.default;
        }, function (_flagrowMasqueradeAddProfilePane) {
            addProfilePane = _flagrowMasqueradeAddProfilePane.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-masquerade', function (app) {
                app.store.models['masquerade-field'] = Field;
                app.store.models['masquerade-answer'] = Answer;

                addProfileConfigurePane();
                addProfilePane();
            });
        }
    };
});;
'use strict';

System.register('flagrow/masquerade/models/Answer', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var Model, mixin, Answer;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            Answer = function (_mixin) {
                babelHelpers.inherits(Answer, _mixin);

                function Answer() {
                    babelHelpers.classCallCheck(this, Answer);
                    return babelHelpers.possibleConstructorReturn(this, (Answer.__proto__ || Object.getPrototypeOf(Answer)).apply(this, arguments));
                }

                babelHelpers.createClass(Answer, [{
                    key: 'apiEndpoint',
                    value: function apiEndpoint() {
                        return '/masquerade/configure' + (this.exists ? '/' + this.data.id : '');
                    }
                }]);
                return Answer;
            }(mixin(Model, {
                content: Model.attribute('content'),
                field: Model.hasOne('field')
            }));

            _export('default', Answer);
        }
    };
});;
'use strict';

System.register('flagrow/masquerade/models/Field', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var Model, mixin, Field;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            Field = function (_mixin) {
                babelHelpers.inherits(Field, _mixin);

                function Field() {
                    babelHelpers.classCallCheck(this, Field);
                    return babelHelpers.possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).apply(this, arguments));
                }

                babelHelpers.createClass(Field, [{
                    key: 'apiEndpoint',
                    value: function apiEndpoint() {
                        return '/masquerade/fields' + (this.exists ? '/' + this.data.id : '');
                    }
                }]);
                return Field;
            }(mixin(Model, {
                name: Model.attribute('name'),
                description: Model.attribute('description'),
                validation: Model.attribute('validation'),
                required: Model.attribute('required'),
                prefix: Model.attribute('prefix'),
                icon: Model.attribute('icon'),
                sort: Model.attribute('sort'),
                deleted_at: Model.attribute('deleted_at', Model.transformDate),
                answer: Model.hasOne('answer')
            }));

            _export('default', Field);
        }
    };
});;
"use strict";

System.register("flagrow/masquerade/panes/ProfileConfigurePane", ["flarum/components/UserPage", "flarum/helpers/icon", "flarum/components/Button"], function (_export, _context) {
    "use strict";

    var UserPage, icon, Button, ProfileConfigurePane;
    return {
        setters: [function (_flarumComponentsUserPage) {
            UserPage = _flarumComponentsUserPage.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }],
        execute: function () {
            ProfileConfigurePane = function (_UserPage) {
                babelHelpers.inherits(ProfileConfigurePane, _UserPage);

                function ProfileConfigurePane() {
                    babelHelpers.classCallCheck(this, ProfileConfigurePane);
                    return babelHelpers.possibleConstructorReturn(this, (ProfileConfigurePane.__proto__ || Object.getPrototypeOf(ProfileConfigurePane)).apply(this, arguments));
                }

                babelHelpers.createClass(ProfileConfigurePane, [{
                    key: "init",
                    value: function init() {
                        babelHelpers.get(ProfileConfigurePane.prototype.__proto__ || Object.getPrototypeOf(ProfileConfigurePane.prototype), "init", this).call(this);
                        this.loading = true;

                        this.loadUser(app.session.user.username());
                        this.enforceProfileCompletion = app.forum.attribute('masquerade.force-profile-completion') || false;
                        this.profileCompleted = app.forum.attribute('masquerade.profile-completed') || false;
                        this.fields = [];
                        this.answers = {};
                        this.load();
                    }
                }, {
                    key: "content",
                    value: function content() {
                        var _this2 = this;

                        return m('form', {
                            className: 'ProfileConfigurePane',
                            onsubmit: this.update.bind(this)
                        }, [this.enforceProfileCompletion && !this.profileCompleted ? m('div', { className: 'Alert Alert--Error' }, app.translator.trans('flagrow-masquerade.forum.alerts.profile-completion-required')) : '', m('div', { className: 'Fields' }, this.fields.sort(function (a, b) {
                            return a.sort() - b.sort();
                        }).map(function (field) {
                            if (!(field.id() in _this2.answers)) {
                                _this2.answers[field.id()] = field.answer() ? m.prop(field.answer().content()) : m.prop('');
                            }
                            return _this2.field(field);
                        })), Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-masquerade.forum.buttons.save-profile'),
                            loading: this.loading
                        })]);
                    }
                }, {
                    key: "field",
                    value: function field(_field) {
                        return m('fieldset', { className: 'Field' }, [m('legend', [_field.icon() ? icon(_field.icon()) : '', _field.name(), _field.required() ? ' *' : '']), m('div', { className: 'FormField' }, [_field.prefix() ? m('div', { className: 'prefix' }, _field.prefix()) : '', m('input', {
                            className: 'FormControl',
                            oninput: m.withAttr('value', this.set.bind(this, _field)),
                            value: this.answers[_field.id()](),
                            required: _field.required()
                        }), _field.description() ? m('span', { className: 'helpText' }, _field.description()) : ''])]);
                    }
                }, {
                    key: "load",
                    value: function load() {
                        app.request({
                            method: 'GET',
                            url: app.forum.attribute('apiUrl') + '/masquerade/configure'
                        }).then(this.parseResponse.bind(this));
                    }
                }, {
                    key: "set",
                    value: function set(field, value) {
                        if (!(field.id() in this.answers)) {
                            this.answers[field.id()] = m.prop(value);
                        } else {
                            this.answers[field.id()](value);
                        }
                    }
                }, {
                    key: "update",
                    value: function update(e) {
                        e.preventDefault();

                        this.loading = true;
                        var data = this.answers;

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/masquerade/configure',
                            data: data
                        }).then(this.parseResponse.bind(this));
                    }
                }, {
                    key: "parseResponse",
                    value: function parseResponse(response) {
                        this.fields = app.store.pushPayload(response);
                        this.loading = false;
                        m.redraw();
                    }
                }]);
                return ProfileConfigurePane;
            }(UserPage);

            _export("default", ProfileConfigurePane);
        }
    };
});;
'use strict';

System.register('flagrow/masquerade/panes/ProfilePane', ['flarum/components/UserPage', 'flarum/helpers/icon'], function (_export, _context) {
    "use strict";

    var UserPage, icon, ProfileConfigurePane;
    return {
        setters: [function (_flarumComponentsUserPage) {
            UserPage = _flarumComponentsUserPage.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }],
        execute: function () {
            ProfileConfigurePane = function (_UserPage) {
                babelHelpers.inherits(ProfileConfigurePane, _UserPage);

                function ProfileConfigurePane() {
                    babelHelpers.classCallCheck(this, ProfileConfigurePane);
                    return babelHelpers.possibleConstructorReturn(this, (ProfileConfigurePane.__proto__ || Object.getPrototypeOf(ProfileConfigurePane)).apply(this, arguments));
                }

                babelHelpers.createClass(ProfileConfigurePane, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(ProfileConfigurePane.prototype.__proto__ || Object.getPrototypeOf(ProfileConfigurePane.prototype), 'init', this).call(this);
                        this.loading = true;

                        this.fields = [];
                        this.answers = {};
                        console.log(m.route.param('username'));
                        this.loadUser(m.route.param('username'));
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        var _this2 = this;

                        return m('div', {
                            className: 'ProfilePane'
                        }, [m('div', { className: 'Fields' }, this.fields.sort(function (a, b) {
                            return a.sort() - b.sort();
                        }).map(function (field) {
                            if (!(field.id() in _this2.answers)) {
                                _this2.answers[field.id()] = field.answer() ? m.prop(field.answer().content()) : m.prop('');
                            }
                            return _this2.field(field);
                        }))]);
                    }
                }, {
                    key: 'field',
                    value: function field(_field) {
                        return m('fieldset', { className: 'Field' }, [m('legend', [_field.icon() ? icon(_field.icon()) : '', _field.name()]), m('div', { className: 'FormField' }, [_field.prefix() ? m('div', { className: 'prefix' }, _field.prefix()) : '', m('div', {
                            className: 'FormControl'
                        }, this.answers[_field.id()]())])]);
                    }
                }, {
                    key: 'load',
                    value: function load(user) {
                        app.request({
                            method: 'GET',
                            url: app.forum.attribute('apiUrl') + '/masquerade/profile/' + user.id()
                        }).then(this.parseResponse.bind(this));
                    }
                }, {
                    key: 'show',
                    value: function show(user) {
                        this.load(user);

                        babelHelpers.get(ProfileConfigurePane.prototype.__proto__ || Object.getPrototypeOf(ProfileConfigurePane.prototype), 'show', this).call(this, user);
                    }
                }, {
                    key: 'parseResponse',
                    value: function parseResponse(response) {
                        this.fields = app.store.pushPayload(response);
                        this.loading = false;
                        m.redraw();
                    }
                }]);
                return ProfileConfigurePane;
            }(UserPage);

            _export('default', ProfileConfigurePane);
        }
    };
});