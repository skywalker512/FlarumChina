System.register("ganuonglachanh/mdeditor/addEditorPane", ["flarum/extend", "flarum/components/AdminNav", "flarum/components/AdminLinkButton", "ganuonglachanh/mdeditor/components/EditorPage"], function (_export) {
    "use strict";

    var extend, AdminNav, AdminLinkButton, EditorPage;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav["default"];
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton["default"];
        }, function (_ganuonglachanhMdeditorComponentsEditorPage) {
            EditorPage = _ganuonglachanhMdeditorComponentsEditorPage["default"];
        }],
        execute: function () {
            _export("default", function () {
                // create the route
                app.routes['ganuonglachanh-mdeditor'] = { path: '/ganuonglachanh/mdeditor', component: EditorPage.component() };

                // bind the route we created to the three dots settings button
                app.extensionSettings['ganuonglachanh-mdeditor'] = function () {
                    return m.route(app.route('ganuonglachanh-mdeditor'));
                };

                extend(AdminNav.prototype, 'items', function (items) {
                    // add the Editor tab to the admin navigation menu
                    items.add('ganuonglachanh-mdeditor', AdminLinkButton.component({
                        href: app.route('ganuonglachanh-mdeditor'),
                        icon: 'pencil',
                        children: app.translator.trans('ganuonglachanh-mdeditor.admin.help_texts.title'),
                        description: app.translator.trans('ganuonglachanh-mdeditor.admin.help_texts.description')
                    }));
                });
            });
        }
    };
});;
System.register("ganuonglachanh/mdeditor/components/EditorPage", ["flarum/Component", "flarum/components/Button", "flarum/utils/saveSettings", "flarum/components/Alert", "flarum/components/Select", "flarum/components/Switch"], function (_export) {
    "use strict";

    var Component, Button, saveSettings, Alert, Select, Switch, EditorPage;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent["default"];
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton["default"];
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings["default"];
        }, function (_flarumComponentsAlert) {
            Alert = _flarumComponentsAlert["default"];
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect["default"];
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch["default"];
        }],
        execute: function () {
            EditorPage = (function (_Component) {
                babelHelpers.inherits(EditorPage, _Component);

                function EditorPage() {
                    babelHelpers.classCallCheck(this, EditorPage);
                    babelHelpers.get(Object.getPrototypeOf(EditorPage.prototype), "constructor", this).apply(this, arguments);
                }

                babelHelpers.createClass(EditorPage, [{
                    key: "init",
                    value: function init() {
                        var _this = this;

                        // whether we are saving the settings or not right now
                        this.loading = false;

                        // the fields we need to watch and to save
                        this.fields = ['symbols'];

                        this.values = {};

                        // our package prefix (to be added to every field and checkbox in the setting table)
                        this.settingsPrefix = 'ganuonglachanh.mdeditor';

                        // get the saved settings from the database
                        var settings = app.data.settings;

                        // bind the values of the fields and checkboxes to the getter/setter functions
                        this.fields.forEach(function (key) {
                            return _this.values[key] = m.prop(settings[_this.addPrefix(key)]);
                        });
                    }

                    /**
                     * Show the actual EditorPage.
                     *
                     * @returns {*}
                     */
                }, {
                    key: "view",
                    value: function view() {
                        return m(
                            "div",
                            { className: "EditorPage" },
                            m(
                                "div",
                                { className: "container" },
                                m(
                                    "form",
                                    { onsubmit: this.onsubmit.bind(this) },
                                    m(
                                        "fieldset",
                                        { className: "EditorPage-preferences" },
                                        m(
                                            "legend",
                                            null,
                                            app.translator.trans('ganuonglachanh-mdeditor.admin.labels.preferences.title')
                                        ),
                                        m(
                                            "label",
                                            null,
                                            app.translator.trans('ganuonglachanh-mdeditor.admin.labels.preferences.symbols')
                                        ),
                                        m("textarea", { className: "FormControl",
                                            value: this.values.symbols() || '',
                                            oninput: m.withAttr('value', this.values.symbols) })
                                    ),
                                    Button.component({
                                        type: 'submit',
                                        className: 'Button Button--primary',
                                        children: app.translator.trans('ganuonglachanh-mdeditor.admin.buttons.save'),
                                        loading: this.loading,
                                        disabled: !this.changed()
                                    })
                                )
                            )
                        );
                    }

                    /**
                     * Checks if the values of the fields and checkboxes are different from
                     * the ones stored in the database
                     *
                     * @returns boolean
                     */
                }, {
                    key: "changed",
                    value: function changed() {
                        var _this2 = this;

                        var fieldsCheck = this.fields.some(function (key) {
                            return _this2.values[key]() !== app.data.settings[_this2.addPrefix(key)];
                        });
                        return fieldsCheck;
                    }

                    /**
                     * Saves the settings to the database and redraw the page
                     *
                     * @param e
                     */
                }, {
                    key: "onsubmit",
                    value: function onsubmit(e) {
                        var _this3 = this;

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
                        this.fields.forEach(function (key) {
                            return settings[_this3.addPrefix(key)] = _this3.values[key]();
                        });

                        // actually saves everything in the database
                        saveSettings(settings).then(function () {
                            // on success, show popup
                            app.alerts.show(_this3.successAlert = new Alert({
                                type: 'success',
                                children: app.translator.trans('core.admin.basics.saved_message')
                            }));
                        })["catch"](function () {}).then(function () {
                            // return to the initial state and redraw the page
                            _this3.loading = false;
                            m.redraw();
                        });
                    }

                    /**
                     * Adds the prefix `this.settingsPrefix` at the beginning of `key`
                     *
                     * @returns string
                     */
                }, {
                    key: "addPrefix",
                    value: function addPrefix(key) {
                        return this.settingsPrefix + '.' + key;
                    }
                }]);
                return EditorPage;
            })(Component);

            _export("default", EditorPage);
        }
    };
});;
System.register("ganuonglachanh/mdeditor/main", ["flarum/extend", "flarum/app", "flarum/components/PermissionGrid", "ganuonglachanh/mdeditor/addEditorPane"], function (_export) {
    "use strict";

    var extend, app, PermissionGrid, addEditorPane;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp["default"];
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid["default"];
        }, function (_ganuonglachanhMdeditorAddEditorPane) {
            addEditorPane = _ganuonglachanhMdeditorAddEditorPane["default"];
        }],
        execute: function () {

            app.initializers.add('ganuonglachanh-mdeditor', function (app) {
                // add the admin pane
                addEditorPane();
            });
        }
    };
});