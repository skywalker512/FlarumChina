'use strict';

System.register('flagrow/image-upload/addImageUploadPane', ['flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'flagrow/image-upload/components/ImageUploadPage'], function (_export, _context) {
    "use strict";

    var extend, AdminNav, AdminLinkButton, ImageUploadPage;

    _export('default', function () {
        // create the route
        app.routes['image-upload'] = { path: '/image-upload', component: ImageUploadPage.component() };

        // bind the route we created to the three dots settings button
        app.extensionSettings['flagrow-image-upload'] = function () {
            return m.route(app.route('image-upload'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            // add the Image Upload tab to the admin navigation menu
            items.add('image-upload', AdminLinkButton.component({
                href: app.route('image-upload'),
                icon: 'picture-o',
                children: 'Image Upload',
                description: app.translator.trans('flagrow-image-upload.admin.help_texts.description')
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
        }, function (_flagrowImageUploadComponentsImageUploadPage) {
            ImageUploadPage = _flagrowImageUploadComponentsImageUploadPage.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("flagrow/image-upload/components/ImageUploadPage", ["flarum/Component", "flarum/components/Button", "flarum/utils/saveSettings", "flarum/components/Alert", "flarum/components/FieldSet", "flarum/components/Select", "flarum/components/Switch"], function (_export, _context) {
    "use strict";

    var Component, Button, saveSettings, Alert, FieldSet, Select, Switch, ImageUploadPage;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }, function (_flarumComponentsAlert) {
            Alert = _flarumComponentsAlert.default;
        }, function (_flarumComponentsFieldSet) {
            FieldSet = _flarumComponentsFieldSet.default;
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect.default;
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch.default;
        }],
        execute: function () {
            ImageUploadPage = function (_Component) {
                babelHelpers.inherits(ImageUploadPage, _Component);

                function ImageUploadPage() {
                    babelHelpers.classCallCheck(this, ImageUploadPage);
                    return babelHelpers.possibleConstructorReturn(this, (ImageUploadPage.__proto__ || Object.getPrototypeOf(ImageUploadPage)).apply(this, arguments));
                }

                babelHelpers.createClass(ImageUploadPage, [{
                    key: "init",
                    value: function init() {
                        var _this2 = this;

                        // whether we are saving the settings or not right now
                        this.loading = false;

                        // the fields we need to watch and to save
                        this.fields = ['availableUploadMethods', 'uploadMethod', 'imgurClientId', 'resizeMaxWidth', 'resizeMaxHeight', 'cdnUrl', 'maxFileSize', 'cloudinaryApiKey', 'cloudinaryApiSecret', 'cloudinaryCloudName'];

                        // the checkboxes we need to watch and to save.
                        this.checkboxes = ['mustResize'];

                        // options for the dropdown menu
                        this.uploadMethodOptions = {};

                        this.values = {};

                        // our package prefix (to be added to every field and checkbox in the setting table)
                        this.settingsPrefix = 'flagrow.image-upload';

                        // get the saved settings from the database
                        var settings = app.data.settings;

                        // set the upload methods
                        this.uploadMethodOptions = settings[this.addPrefix('availableUploadMethods')];
                        // bind the values of the fields and checkboxes to the getter/setter functions
                        this.fields.forEach(function (key) {
                            return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)]);
                        });
                        this.checkboxes.forEach(function (key) {
                            return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)] === '1');
                        });
                    }
                }, {
                    key: "view",
                    value: function view() {
                        return [m('div', { className: 'ImageUploadPage' }, [m('div', { className: 'container' }, [m('form', { onsubmit: this.onsubmit.bind(this) }, [FieldSet.component({
                            label: app.translator.trans('flagrow-image-upload.admin.labels.upload_method'),
                            children: [m('div', { className: 'helpText' }, app.translator.trans('flagrow-image-upload.admin.help_texts.upload_method')), Select.component({
                                options: this.uploadMethodOptions,
                                onchange: this.values.uploadMethod,
                                value: this.values.uploadMethod() || 'local'
                            })]
                        }), m('div', { className: 'ImageUploadPage-preferences' }, [FieldSet.component({
                            label: app.translator.trans('flagrow-image-upload.admin.labels.preferences.title'),
                            children: [m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.preferences.max_file_size')), m('input', {
                                className: 'FormControl',
                                value: this.values.maxFileSize() || 2048,
                                oninput: m.withAttr('value', this.values.maxFileSize)
                            })]
                        })]), m('div', { className: 'ImageUploadPage-resize' }, [FieldSet.component({
                            label: app.translator.trans('flagrow-image-upload.admin.labels.resize.title'),
                            children: [m('div', { className: 'helpText' }, app.translator.trans('flagrow-image-upload.admin.help_texts.resize')), Switch.component({
                                state: this.values.mustResize() || false,
                                children: app.translator.trans('flagrow-image-upload.admin.labels.resize.toggle'),
                                onchange: this.values.mustResize
                            }), m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.resize.max_width')), m('input', {
                                className: 'FormControl',
                                value: this.values.resizeMaxWidth() || 100,
                                oninput: m.withAttr('value', this.values.resizeMaxWidth),
                                disabled: !this.values.mustResize()
                            }), m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.resize.max_height')), m('input', {
                                className: 'FormControl',
                                value: this.values.resizeMaxHeight() || 100,
                                oninput: m.withAttr('value', this.values.resizeMaxHeight),
                                disabled: !this.values.mustResize()
                            })]
                        })]), m('div', { className: 'ImageUploadPage-imgur', style: { display: this.values.uploadMethod() === 'imgur' ? "block" : "none" } }, [FieldSet.component({
                            label: app.translator.trans('flagrow-image-upload.admin.labels.imgur.title'),
                            children: [m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.imgur.client_id')), m('input', {
                                className: 'FormControl',
                                value: this.values.imgurClientId() || '',
                                oninput: m.withAttr('value', this.values.imgurClientId)
                            })]
                        })]), m('div', { className: 'ImageUploadPage-local', style: { display: this.values.uploadMethod() === 'local' ? "block" : "none" } }, [FieldSet.component({
                            label: app.translator.trans('flagrow-image-upload.admin.labels.local.title'),
                            children: [m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.local.cdn_url')), m('input', {
                                className: 'FormControl',
                                value: this.values.cdnUrl() || '',
                                oninput: m.withAttr('value', this.values.cdnUrl)
                            })]
                        })]), m('div', { className: 'ImageUploadPage-cloudinary', style: { display: this.values.uploadMethod() === 'cloudinary' ? "block" : "none" } }, [FieldSet.component({
                            label: app.translator.trans('flagrow-image-upload.admin.labels.cloudinary.title'),
                            children: [m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.cloudinary.cloud_name')), m('input', {
                                className: 'FormControl',
                                value: this.values.cloudinaryCloudName() || '',
                                oninput: m.withAttr('value', this.values.cloudinaryCloudName)
                            }), m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.cloudinary.api_key')), m('input', {
                                className: 'FormControl',
                                value: this.values.cloudinaryApiKey() || '',
                                oninput: m.withAttr('value', this.values.cloudinaryApiKey)
                            }), m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.cloudinary.api_secret')), m('input', {
                                className: 'FormControl',
                                value: this.values.cloudinaryApiSecret() || '',
                                oninput: m.withAttr('value', this.values.cloudinaryApiSecret)
                            })]
                        })]), Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-image-upload.admin.buttons.save'),
                            loading: this.loading,
                            disabled: !this.changed()
                        })])])])];
                    }
                }, {
                    key: "changed",
                    value: function changed() {
                        var _this3 = this;

                        var fieldsCheck = this.fields.some(function (key) {
                            return _this3.values[key]() !== app.data.settings[_this3.addPrefix(key)];
                        });
                        var checkboxesCheck = this.checkboxes.some(function (key) {
                            return _this3.values[key]() !== (app.data.settings[_this3.addPrefix(key)] == '1');
                        });
                        return fieldsCheck || checkboxesCheck;
                    }
                }, {
                    key: "onsubmit",
                    value: function onsubmit(e) {
                        var _this4 = this;

                        // prevent the usual form submit behaviour
                        e.preventDefault();

                        // if the page is already saving, do nothing
                        if (this.loading) return;

                        // prevents multiple savings
                        this.loading = true;
                        app.alerts.dismiss(this.successAlert);

                        var settings = {};

                        // gets all the values from the form
                        this.fields.forEach(function (key) {
                            return settings[_this4.addPrefix(key)] = _this4.values[key]();
                        });
                        this.checkboxes.forEach(function (key) {
                            return settings[_this4.addPrefix(key)] = _this4.values[key]();
                        });

                        // actually saves everything in the database
                        saveSettings(settings).then(function () {
                            // on succes, show an alert
                            app.alerts.show(_this4.successAlert = new Alert({
                                type: 'success',
                                children: app.translator.trans('core.admin.basics.saved_message')
                            }));
                        }).catch(function () {
                        }).then(function () {
                            // return to the initial state and redraw the page
                            _this4.loading = false;
                            m.redraw();
                        });
                    }
                }, {
                    key: "addPrefix",
                    value: function addPrefix(key) {
                        return this.settingsPrefix + '.' + key;
                    }
                }]);
                return ImageUploadPage;
            }(Component);

            _export("default", ImageUploadPage);
        }
    };
});;
'use strict';

System.register('flagrow/image-upload/main', ['flarum/extend', 'flarum/app', 'flarum/utils/saveSettings', 'flarum/components/PermissionGrid', 'flagrow/image-upload/addImageUploadPane'], function (_export, _context) {
    "use strict";

    var extend, app, saveSettings, PermissionGrid, addImageUploadPane;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }, function (_flagrowImageUploadAddImageUploadPane) {
            addImageUploadPane = _flagrowImageUploadAddImageUploadPane.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-image-upload', function (app) {
                // add the admin pane
                addImageUploadPane();

                // add the permission option to the relative pane
                extend(PermissionGrid.prototype, 'startItems', function (items) {
                    items.add('uploadImages', {
                        icon: 'picture-o',
                        label: app.translator.trans('flagrow-image-upload.admin.permissions.upload_images_label'),
                        permission: 'flagrow.image.upload'
                    });
                });
            });
        }
    };
});