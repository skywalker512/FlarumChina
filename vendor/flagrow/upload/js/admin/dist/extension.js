"use strict";

System.register("flagrow/upload/addUploadPane", ["flarum/extend", "flarum/components/AdminNav", "flarum/components/AdminLinkButton", "flagrow/upload/components/UploadPage"], function (_export, _context) {
    "use strict";

    var extend, AdminNav, AdminLinkButton, UploadPage;

    _export("default", function () {
        // create the route
        app.routes['flagrow-upload'] = { path: '/flagrow/upload', component: UploadPage.component() };

        // bind the route we created to the three dots settings button
        app.extensionSettings['flagrow-upload'] = function () {
            return m.route(app.route('flagrow-upload'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            // add the Image Upload tab to the admin navigation menu
            items.add('flagrow-upload', AdminLinkButton.component({
                href: app.route('flagrow-upload'),
                icon: 'file-o',
                children: 'File Upload',
                description: app.translator.trans('flagrow-upload.admin.help_texts.description')
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
        }, function (_flagrowUploadComponentsUploadPage) {
            UploadPage = _flagrowUploadComponentsUploadPage.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("flagrow/upload/components/UploadPage", ["flarum/Component", "flarum/components/Button", "flarum/utils/saveSettings", "flarum/components/Alert", "flarum/components/Select", "flarum/components/Switch", "flarum/components/UploadImageButton"], function (_export, _context) {
    "use strict";

    var Component, Button, saveSettings, Alert, Select, Switch, UploadImageButton, UploadPage;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }, function (_flarumComponentsAlert) {
            Alert = _flarumComponentsAlert.default;
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect.default;
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch.default;
        }, function (_flarumComponentsUploadImageButton) {
            UploadImageButton = _flarumComponentsUploadImageButton.default;
        }],
        execute: function () {
            UploadPage = function (_Component) {
                babelHelpers.inherits(UploadPage, _Component);

                function UploadPage() {
                    babelHelpers.classCallCheck(this, UploadPage);
                    return babelHelpers.possibleConstructorReturn(this, (UploadPage.__proto__ || Object.getPrototypeOf(UploadPage)).apply(this, arguments));
                }

                babelHelpers.createClass(UploadPage, [{
                    key: "init",
                    value: function init() {
                        var _this2 = this;

                        // whether we are saving the settings or not right now
                        this.loading = false;

                        // the fields we need to watch and to save
                        this.fields = [
                        // image
                        'resizeMaxWidth', 'cdnUrl', 'maxFileSize', 'overrideAvatarUpload',
                        // watermark
                        'addsWatermarks', 'watermark', 'watermarkPosition',
                        // Imgur
                        'imgurClientId',
                        // AWS
                        'awsS3Key', 'awsS3Secret', 'awsS3Bucket', 'awsS3Region',
                        // OVH
                        'ovhUsername', 'ovhPassword', 'ovhTenantId', 'ovhContainer', 'ovhRegion'];

                        // the checkboxes we need to watch and to save.
                        this.checkboxes = ['mustResize', 'overrideAvatarUpload', 'disableHotlinkProtection', 'disableDownloadLogging'];

                        // fields that are objects
                        this.objects = ['mimeTypes'];

                        // watermark positions
                        this.watermarkPositions = {
                            'top-left': 'top-left',
                            'top-right': 'top-right',
                            'bottom-left': 'bottom-left',
                            'bottom-right': 'bottom-right',
                            'center': 'center',
                            'left': 'left',
                            'top': 'top',
                            'right': 'right',
                            'bottom': 'bottom'
                        };

                        // options for the dropdown menu
                        this.uploadMethodOptions = {};

                        this.values = {};

                        // our package prefix (to be added to every field and checkbox in the setting table)
                        this.settingsPrefix = 'flagrow.upload';

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
                        this.objects.forEach(function (key) {
                            return _this2.values[key] = settings[_this2.addPrefix(key)] ? m.prop(JSON.parse(settings[_this2.addPrefix(key)])) : m.prop();
                        });

                        this.values.mimeTypes() || (this.values.mimeTypes = m.prop({
                            '^image\\/.*': 'local'
                        }));

                        this.newMimeType = {
                            'regex': m.prop(''),
                            'adapter': m.prop('local')
                        };
                    }
                }, {
                    key: "view",
                    value: function view() {
                        var _this3 = this;

                        return [m('div', { className: 'UploadPage' }, [m('div', { className: 'container' }, [m('form', { onsubmit: this.onsubmit.bind(this) }, [m('fieldset', { className: 'UploadPage-preferences' }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.max_file_size')), m('input', {
                            className: 'FormControl',
                            value: this.values.maxFileSize() || 2048,
                            oninput: m.withAttr('value', this.values.maxFileSize)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.mime_types')), m('div', { className: 'MimeTypes--Container' }, Object.keys(this.values.mimeTypes()).map(function (mime) {
                            return m('div', {}, [m('input', {
                                className: 'FormControl MimeTypes',
                                value: mime,
                                oninput: m.withAttr('value', _this3.updateMimeTypeKey.bind(_this3, mime))
                            }), Select.component({
                                options: _this3.uploadMethodOptions,
                                onchange: _this3.updateMimeTypeValue.bind(_this3, mime),
                                value: _this3.values.mimeTypes()[mime] || 'local'
                            }), Button.component({
                                type: 'button',
                                className: 'Button Button--warning',
                                children: 'x',
                                onclick: _this3.deleteMimeType.bind(_this3, mime)
                            })]);
                        }), m('br'), m('div', {}, [m('input', {
                            className: 'FormControl MimeTypes add-MimeType-key',
                            value: this.newMimeType.regex(),
                            oninput: m.withAttr('value', this.newMimeType.regex)
                        }), Select.component({
                            options: this.uploadMethodOptions,
                            className: 'add-MimeType-value',
                            oninput: m.withAttr('value', this.newMimeType.adapter),
                            value: this.newMimeType.adapter()
                        }), Button.component({
                            type: 'button',
                            className: 'Button Button--warning',
                            children: '+',
                            onclick: this.addMimeType.bind(this)
                        })])), m('div', { className: 'helpText' }, app.translator.trans('flagrow-upload.admin.help_texts.mime_types'))]), m('fieldset', { className: 'UploadPage-resize' }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.resize.title')), m('div', { className: 'helpText' }, app.translator.trans('flagrow-upload.admin.help_texts.resize')), Switch.component({
                            state: this.values.mustResize() || false,
                            children: app.translator.trans('flagrow-upload.admin.labels.resize.toggle'),
                            onchange: this.values.mustResize
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.resize.max_width')), m('input', {
                            className: 'FormControl',
                            value: this.values.resizeMaxWidth() || 100,
                            oninput: m.withAttr('value', this.values.resizeMaxWidth),
                            disabled: !this.values.mustResize()
                        })]), m('fieldset', { className: 'UploadPage-watermark' }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.title')), m('div', { className: 'helpText' }, app.translator.trans('flagrow-upload.admin.help_texts.watermark')), Switch.component({
                            state: this.values.addsWatermarks() || false,
                            children: app.translator.trans('flagrow-upload.admin.labels.watermark.toggle'),
                            onchange: this.values.addsWatermarks
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.position')), m('div', {}, [Select.component({
                            options: this.watermarkPositions,
                            onchange: this.values.watermarkPosition,
                            value: this.values.watermarkPosition() || 'bottom-right'
                        })]), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.file')), m(UploadImageButton, { name: "flagrow/watermark" })]), m('fieldset', { className: 'UploadPage-downloading' }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.disable-hotlink-protection.title')), m('div', { className: 'helpText' }, app.translator.trans('flagrow-upload.admin.help_texts.disable-hotlink-protection')), Switch.component({
                            state: this.values.disableHotlinkProtection() || false,
                            children: app.translator.trans('flagrow-upload.admin.labels.disable-hotlink-protection.toggle'),
                            onchange: this.values.disableHotlinkProtection
                        }), m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.disable-download-logging.title')), m('div', { className: 'helpText' }, app.translator.trans('flagrow-upload.admin.help_texts.disable-download-logging')), Switch.component({
                            state: this.values.disableDownloadLogging() || false,
                            children: app.translator.trans('flagrow-upload.admin.labels.disable-download-logging.toggle'),
                            onchange: this.values.disableDownloadLogging
                        })]), m('fieldset', {
                            className: 'UploadPage-local'
                        }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.local.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.local.cdn_url')), m('input', {
                            className: 'FormControl',
                            value: this.values.cdnUrl() || '',
                            oninput: m.withAttr('value', this.values.cdnUrl)
                        })]), m('fieldset', {
                            className: 'UploadPage-imgur'
                        }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.imgur.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.imgur.client_id')), m('input', {
                            className: 'FormControl',
                            value: this.values.imgurClientId() || '',
                            oninput: m.withAttr('value', this.values.imgurClientId)
                        })]), m('fieldset', {
                            className: 'UploadPage-aws-s3'
                        }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.key')), m('input', {
                            className: 'FormControl',
                            value: this.values.awsS3Key() || '',
                            oninput: m.withAttr('value', this.values.awsS3Key)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.secret')), m('input', {
                            className: 'FormControl',
                            value: this.values.awsS3Secret() || '',
                            oninput: m.withAttr('value', this.values.awsS3Secret)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.bucket')), m('input', {
                            className: 'FormControl',
                            value: this.values.awsS3Bucket() || '',
                            oninput: m.withAttr('value', this.values.awsS3Bucket)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.region')), m('input', {
                            className: 'FormControl',
                            value: this.values.awsS3Region() || '',
                            oninput: m.withAttr('value', this.values.awsS3Region)
                        })]), m('fieldset', {
                            className: 'UploadPage-ovh-svfs'
                        }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.container')), m('input', {
                            className: 'FormControl',
                            value: this.values.ovhContainer() || '',
                            oninput: m.withAttr('value', this.values.ovhContainer)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.tenantid')), m('input', {
                            className: 'FormControl',
                            value: this.values.ovhTenantId() || '',
                            oninput: m.withAttr('value', this.values.ovhTenantId)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.username')), m('input', {
                            className: 'FormControl',
                            value: this.values.ovhUsername() || '',
                            oninput: m.withAttr('value', this.values.ovhUsername)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.password')), m('input', {
                            className: 'FormControl',
                            value: this.values.ovhPassword() || '',
                            oninput: m.withAttr('value', this.values.ovhPassword)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.region')), m('input', {
                            className: 'FormControl',
                            value: this.values.ovhRegion() || '',
                            oninput: m.withAttr('value', this.values.ovhRegion)
                        })]), Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-upload.admin.buttons.save'),
                            loading: this.loading,
                            disabled: !this.changed()
                        })])])])];
                    }
                }, {
                    key: "updateMimeTypeKey",
                    value: function updateMimeTypeKey(mime, value) {
                        this.values.mimeTypes()[value] = this.values.mimeTypes()[mime];

                        this.deleteMimeType(mime);
                    }
                }, {
                    key: "updateMimeTypeValue",
                    value: function updateMimeTypeValue(mime, value) {
                        this.values.mimeTypes()[mime] = value;
                    }
                }, {
                    key: "deleteMimeType",
                    value: function deleteMimeType(mime) {
                        delete this.values.mimeTypes()[mime];
                    }
                }, {
                    key: "addMimeType",
                    value: function addMimeType() {
                        this.values.mimeTypes()[this.newMimeType.regex()] = this.newMimeType.adapter();

                        this.newMimeType.regex('');
                        this.newMimeType.adapter('local');
                    }
                }, {
                    key: "changed",
                    value: function changed() {
                        var _this4 = this;

                        var fieldsCheck = this.fields.some(function (key) {
                            return _this4.values[key]() !== app.data.settings[_this4.addPrefix(key)];
                        });
                        var checkboxesCheck = this.checkboxes.some(function (key) {
                            return _this4.values[key]() !== (app.data.settings[_this4.addPrefix(key)] == '1');
                        });
                        var objectsCheck = this.objects.some(function (key) {
                            return JSON.stringify(_this4.values[key]()) !== app.data.settings[_this4.addPrefix(key)];
                        });
                        return fieldsCheck || checkboxesCheck || objectsCheck;
                    }
                }, {
                    key: "onsubmit",
                    value: function onsubmit(e) {
                        var _this5 = this;

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
                            return settings[_this5.addPrefix(key)] = _this5.values[key]();
                        });
                        this.checkboxes.forEach(function (key) {
                            return settings[_this5.addPrefix(key)] = _this5.values[key]();
                        });
                        this.objects.forEach(function (key) {
                            return settings[_this5.addPrefix(key)] = JSON.stringify(_this5.values[key]());
                        });

                        // actually saves everything in the database
                        saveSettings(settings).then(function () {
                            // on success, show popup
                            app.alerts.show(_this5.successAlert = new Alert({
                                type: 'success',
                                children: app.translator.trans('core.admin.basics.saved_message')
                            }));
                        }).catch(function () {}).then(function () {
                            // return to the initial state and redraw the page
                            _this5.loading = false;
                            m.redraw();
                        });
                    }
                }, {
                    key: "addPrefix",
                    value: function addPrefix(key) {
                        return this.settingsPrefix + '.' + key;
                    }
                }]);
                return UploadPage;
            }(Component);

            _export("default", UploadPage);
        }
    };
});;
"use strict";

System.register("flagrow/upload/main", ["flarum/extend", "flarum/app", "flarum/components/PermissionGrid", "flagrow/upload/addUploadPane"], function (_export, _context) {
    "use strict";

    var extend, app, PermissionGrid, addUploadPane;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }, function (_flagrowUploadAddUploadPane) {
            addUploadPane = _flagrowUploadAddUploadPane.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-upload', function (app) {
                // add the admin pane
                addUploadPane();

                // add the permission option to the relative pane
                extend(PermissionGrid.prototype, 'startItems', function (items) {
                    items.add('upload', {
                        icon: 'file-o',
                        label: app.translator.trans('flagrow-upload.admin.permissions.upload_label'),
                        permission: 'flagrow.upload'
                    });
                });

                // add the permission option to the relative pane
                extend(PermissionGrid.prototype, 'viewItems', function (items) {
                    items.add('download', {
                        icon: 'download',
                        label: app.translator.trans('flagrow-upload.admin.permissions.download_label'),
                        permission: 'flagrow.upload.download',
                        allowGuest: true
                    });
                });
            });
        }
    };
});