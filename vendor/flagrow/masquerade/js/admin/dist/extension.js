"use strict";

System.register("flagrow/masquerade/addProfileConfigurePane", ["flarum/extend", "flarum/components/AdminNav", "flarum/components/AdminLinkButton", "flagrow/masquerade/panes/ProfileConfigurePane"], function (_export, _context) {
    "use strict";

    var extend, AdminNav, AdminLinkButton, ProfileConfigurePane;

    _export("default", function () {
        // create the route
        app.routes['flagrow-masquerade-configure-profile'] = { path: '/flagrow/masquerade/configure', component: ProfileConfigurePane.component() };

        // bind the route we created to the three dots settings button
        app.extensionSettings['flagrow-masquerade'] = function () {
            return m.route(app.route('flagrow-masquerade-configure-profile'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            // add the Image Upload tab to the admin navigation menu
            items.add('flagrow-masquerade-configure-profile', AdminLinkButton.component({
                href: app.route('flagrow-masquerade-configure-profile'),
                icon: 'id-card-o',
                children: 'Masquerade',
                description: app.translator.trans('flagrow-masquerade.admin.menu.description')
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
        }, function (_flagrowMasqueradePanesProfileConfigurePane) {
            ProfileConfigurePane = _flagrowMasqueradePanesProfileConfigurePane.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("flagrow/masquerade/main", ["flarum/extend", "flarum/app", "flarum/components/PermissionGrid", "flagrow/masquerade/models/Field", "flagrow/masquerade/addProfileConfigurePane"], function (_export, _context) {
    "use strict";

    var extend, app, PermissionGrid, Field, addProfileConfigurePane;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }, function (_flagrowMasqueradeModelsField) {
            Field = _flagrowMasqueradeModelsField.default;
        }, function (_flagrowMasqueradeAddProfileConfigurePane) {
            addProfileConfigurePane = _flagrowMasqueradeAddProfileConfigurePane.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-masquerade', function (app) {
                app.store.models['masquerade-field'] = Field;

                // add the permission option for viewing a masquerade profile
                extend(PermissionGrid.prototype, 'viewItems', function (items) {
                    items.add('masquerade-view-profile', {
                        icon: 'id-card-o',
                        label: app.translator.trans('flagrow-masquerade.admin.permissions.view-profile'),
                        permission: 'flagrow.masquerade.view-profile',
                        allowGuest: true
                    });
                });
                // add the permission option for creating a masquerade profile
                extend(PermissionGrid.prototype, 'startItems', function (items) {
                    items.add('masquerade-have-profile', {
                        icon: 'id-card-o',
                        label: app.translator.trans('flagrow-masquerade.admin.permissions.have-profile'),
                        permission: 'flagrow.masquerade.have-profile'
                    });
                });

                addProfileConfigurePane();
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

System.register("flagrow/masquerade/panes/ProfileConfigurePane", ["flarum/Component", "flarum/components/Switch", "flarum/components/Button", "flarum/utils/saveSettings"], function (_export, _context) {
    "use strict";

    var Component, Switch, Button, saveSettings, ProfileConfigurePane;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }],
        execute: function () {
            ProfileConfigurePane = function (_Component) {
                babelHelpers.inherits(ProfileConfigurePane, _Component);

                function ProfileConfigurePane() {
                    babelHelpers.classCallCheck(this, ProfileConfigurePane);
                    return babelHelpers.possibleConstructorReturn(this, (ProfileConfigurePane.__proto__ || Object.getPrototypeOf(ProfileConfigurePane)).apply(this, arguments));
                }

                babelHelpers.createClass(ProfileConfigurePane, [{
                    key: "init",
                    value: function init() {
                        this.resetNew();
                        this.loading = false;
                        this.existing = [];
                        this.loadExisting();
                        this.enforceProfileCompletion = m.prop(app.data.settings['masquerade.force-profile-completion'] == 1);
                    }
                }, {
                    key: "config",
                    value: function config() {
                        var _this2 = this;

                        this.$('.Existing--Fields').sortable({
                            cancel: ''
                        }).on('sortupdate', function (e, ui) {
                            var sorting = _this2.$('.Existing--Fields > .Field').map(function () {
                                return $(this).data('id');
                            }).get();

                            _this2.updateSort(sorting);
                        });
                    }
                }, {
                    key: "view",
                    value: function view() {
                        var _this3 = this;

                        var fields = [];

                        this.existing.sort(function (a, b) {
                            return a.sort() - b.sort();
                        }).forEach(function (field) {
                            // Build array of fields to show.
                            fields.push(_this3.addField(field));
                        });

                        return m('div', {
                            className: 'ProfileConfigurePane'
                        }, [m('div', { className: 'container' }, [m('form', {
                            className: 'Configuration'
                        }, [m('label', ''), [Switch.component({
                            state: this.enforceProfileCompletion(),
                            onchange: this.updateSetting.bind(this, this.enforceProfileCompletion, 'masquerade.force-profile-completion'),
                            children: app.translator.trans('flagrow-masquerade.admin.fields.force-user-to-completion')
                        }), m('br')]]), m('form', {
                            className: 'Existing--Fields'
                        }, fields), m('form', { onsubmit: this.submitAddField.bind(this) }, [this.addField(this.new)])])]);
                    }
                }, {
                    key: "updateSetting",
                    value: function updateSetting(prop, setting, value) {
                        saveSettings(babelHelpers.defineProperty({}, setting, value));

                        prop(value);
                    }
                }, {
                    key: "addField",
                    value: function addField(field) {
                        var _this4 = this;

                        var exists = field.id();

                        return m('fieldset', {
                            className: 'Field',
                            'data-id': field.id()
                        }, [m('legend', [exists ? m('div', { className: 'ButtonGroup pull-right' }, [Button.component({
                            className: 'Button Button--icon Button--danger',
                            icon: "trash",
                            onclick: this.deleteField.bind(this, field)
                        })]) : null, m('span', {
                            className: 'title',
                            onclick: function onclick(e) {
                                return _this4.toggleField(e);
                            }
                        }, app.translator.trans('flagrow-masquerade.admin.fields.' + (exists ? 'edit' : 'add'), {
                            field: field.name()
                        }))]), m('ul', [m('li', [m('label', app.translator.trans('flagrow-masquerade.admin.fields.name')), m('input', {
                            className: 'FormControl',
                            value: field.name(),
                            oninput: m.withAttr('value', this.updateExistingFieldInput.bind(this, 'name', field))
                        }), m('span', { className: 'helpText' }, app.translator.trans('flagrow-masquerade.admin.fields.name-help'))]), m('li', [m('label', app.translator.trans('flagrow-masquerade.admin.fields.description')), m('input', {
                            className: 'FormControl',
                            value: field.description(),
                            oninput: m.withAttr('value', this.updateExistingFieldInput.bind(this, 'description', field))
                        }), m('span', { className: 'helpText' }, app.translator.trans('flagrow-masquerade.admin.fields.description-help'))]), m('li', [m('label', app.translator.trans('flagrow-masquerade.admin.fields.icon')), m('input', {
                            className: 'FormControl',
                            value: field.icon(),
                            oninput: m.withAttr('value', this.updateExistingFieldInput.bind(this, 'icon', field))
                        }), m('span', { className: 'helpText' }, app.translator.trans('flagrow-masquerade.admin.fields.icon-help', {
                            a: m("a", { href: "http://fontawesome.io/icons/", target: "_blank" })
                        }))]),
                        // @todo Disabled for now, wasn't really showing up nicely.
                        // m('li', [
                        //     m('label', app.translator.trans('flagrow-masquerade.admin.fields.prefix')),
                        //     m('input', {
                        //         className: 'FormControl',
                        //         value: field.prefix(),
                        //         oninput: m.withAttr('value', this.updateExistingFieldInput.bind(this, 'prefix', field))
                        //     }),
                        //     m('span', {className: 'helpText'}, app.translator.trans('flagrow-masquerade.admin.fields.prefix-help'))
                        // ]),
                        m('li', [m('label', ''), [Switch.component({
                            state: field.required(),
                            onchange: this.updateExistingFieldInput.bind(this, 'required', field),
                            children: app.translator.trans('flagrow-masquerade.admin.fields.required')
                        }), m('br')]]), m('li', [m('label', app.translator.trans('flagrow-masquerade.admin.fields.validation')), m('input', {
                            className: 'FormControl',
                            value: field.validation(),
                            oninput: m.withAttr('value', this.updateExistingFieldInput.bind(this, 'validation', field))
                        }), m('span', { className: 'helpText' }, app.translator.trans('flagrow-masquerade.admin.fields.validation-help', {
                            a: m("a", { href: "https://laravel.com/docs/5.2/validation#available-validation-rules",
                                target: "_blank" })
                        }))]), m('li', { className: 'ButtonGroup' }, [Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-masquerade.admin.buttons.' + (exists ? 'edit' : 'add') + '-field'),
                            loading: this.loading,
                            disabled: !this.readyToAdd(field),
                            onclick: this.updateExistingField.bind(this, field)
                        }), exists ? Button.component({
                            type: 'submit',
                            className: 'Button Button--danger',
                            children: app.translator.trans('flagrow-masquerade.admin.buttons.delete-field'),
                            loading: this.loading
                        }) : ''])])]);
                    }
                }, {
                    key: "updateExistingFieldInput",
                    value: function updateExistingFieldInput(what, field, value) {
                        var exists = field.id();

                        if (exists) {
                            field.pushAttributes(babelHelpers.defineProperty({}, what, value));
                        } else {
                            field[what](value);
                        }
                    }
                }, {
                    key: "updateSort",
                    value: function updateSort(sorting) {
                        var data = {
                            sort: sorting
                        };

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/masquerade/fields/order',
                            data: data
                        });
                    }
                }, {
                    key: "toggleField",
                    value: function toggleField(e) {
                        $(e.target).parents('.Field').toggleClass('active');
                    }
                }, {
                    key: "deleteField",
                    value: function deleteField(field) {
                        app.request({
                            method: 'DELETE',
                            url: app.forum.attribute('apiUrl') + '/masquerade/fields/' + field.id()
                        }).then(this.requestSuccess.bind(this));
                    }
                }, {
                    key: "submitAddField",
                    value: function submitAddField(e) {
                        e.preventDefault();

                        var data = this.new;

                        // @todo xhr call app.request
                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/masquerade/fields',
                            data: data
                        }).then(this.requestSuccess.bind(this));

                        this.resetNew();

                        m.redraw();
                    }
                }, {
                    key: "updateExistingField",
                    value: function updateExistingField(field) {
                        if (!field.id()) return;

                        var data = field.data;

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/masquerade/fields/' + field.id(),
                            data: data
                        }).then(this.requestSuccess.bind(this));
                    }
                }, {
                    key: "requestSuccess",
                    value: function requestSuccess(result) {
                        var model = app.store.pushPayload(result);

                        // In case we've updated/deleted one instance delete it if necessary.
                        if (!(model instanceof Array) && model.deleted_at()) {
                            app.store.remove(model);
                        }

                        this.existing = app.store.all('masquerade-field');

                        this.loading = false;
                        m.redraw();
                    }
                }, {
                    key: "loadExisting",
                    value: function loadExisting() {
                        this.loading = true;

                        return app.request({
                            method: 'GET',
                            url: app.forum.attribute('apiUrl') + '/masquerade/fields'
                        }).then(this.requestSuccess.bind(this));
                    }
                }, {
                    key: "resetNew",
                    value: function resetNew() {
                        this.new = {
                            'id': m.prop(),
                            'name': m.prop(''),
                            'description': m.prop(''),
                            'prefix': m.prop(''),
                            'icon': m.prop(''),
                            'required': m.prop(false),
                            'validation': m.prop('')
                        };
                    }
                }, {
                    key: "readyToAdd",
                    value: function readyToAdd(field) {
                        if (field.name()) {
                            return true;
                        }

                        return false;
                    }
                }]);
                return ProfileConfigurePane;
            }(Component);

            _export("default", ProfileConfigurePane);
        }
    };
});