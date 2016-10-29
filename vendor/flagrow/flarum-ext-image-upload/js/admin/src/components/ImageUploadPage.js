import Component from "flarum/Component";
import Button from "flarum/components/Button";
import saveSettings from "flarum/utils/saveSettings";
import Alert from "flarum/components/Alert";
import FieldSet from "flarum/components/FieldSet";
import Select from "flarum/components/Select";
import Switch from "flarum/components/Switch";

export default class ImageUploadPage extends Component {

    init() {
        // whether we are saving the settings or not right now
        this.loading = false;

        // the fields we need to watch and to save
        this.fields = [
            'availableUploadMethods',
            'uploadMethod',
            'imgurClientId',
            'resizeMaxWidth',
            'resizeMaxHeight',
            'cdnUrl',
            'maxFileSize',
            'cloudinaryApiKey',
            'cloudinaryApiSecret',
            'cloudinaryCloudName'
        ];

        // the checkboxes we need to watch and to save.
        this.checkboxes = [
            'mustResize'
        ];

        // options for the dropdown menu
        this.uploadMethodOptions = {};

        this.values = {};

        // our package prefix (to be added to every field and checkbox in the setting table)
        this.settingsPrefix = 'flagrow.image-upload';

        // get the saved settings from the database
        const settings = app.data.settings;

        // set the upload methods
        this.uploadMethodOptions = settings[this.addPrefix('availableUploadMethods')];
        // bind the values of the fields and checkboxes to the getter/setter functions
        this.fields.forEach(key => this.values[key] = m.prop(settings[this.addPrefix(key)]));
        this.checkboxes.forEach(key => this.values[key] = m.prop(settings[this.addPrefix(key)] === '1'));
    }

    /**
    * Show the actual ImageUploadPage.
    *
    * @returns {*}
    */
    view() {
        return [
            m('div', {className: 'ImageUploadPage'}, [
                m('div', {className: 'container'}, [
                    m('form', {onsubmit: this.onsubmit.bind(this)}, [
                        FieldSet.component({
                            label: app.translator.trans('flagrow-image-upload.admin.labels.upload_method'),
                            children: [
                                m('div', {className: 'helpText'}, app.translator.trans('flagrow-image-upload.admin.help_texts.upload_method')),
                                Select.component({
                                    options: this.uploadMethodOptions,
                                    onchange: this.values.uploadMethod,
                                    value: this.values.uploadMethod() || 'local'
                                })
                            ]
                        }),
                        m('div', {className: 'ImageUploadPage-preferences'}, [
                            FieldSet.component({
                                label: app.translator.trans('flagrow-image-upload.admin.labels.preferences.title'),
                                children: [
                                    m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.preferences.max_file_size')),
                                    m('input', {
                                        className: 'FormControl',
                                        value: this.values.maxFileSize() || 2048,
                                        oninput: m.withAttr('value', this.values.maxFileSize)
                                    }),
                                ]
                            })
                        ]),
                        m('div', {className: 'ImageUploadPage-resize'}, [
                            FieldSet.component({
                                label: app.translator.trans('flagrow-image-upload.admin.labels.resize.title'),
                                children: [
                                    m('div', {className: 'helpText'}, app.translator.trans('flagrow-image-upload.admin.help_texts.resize')),
                                    Switch.component({
                                        state: this.values.mustResize() || false,
                                        children: app.translator.trans('flagrow-image-upload.admin.labels.resize.toggle'),
                                        onchange: this.values.mustResize
                                    }),
                                    m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.resize.max_width')),
                                    m('input', {
                                        className: 'FormControl',
                                        value: this.values.resizeMaxWidth() || 100,
                                        oninput: m.withAttr('value', this.values.resizeMaxWidth),
                                        disabled: !this.values.mustResize()
                                    }),
                                    m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.resize.max_height')),
                                    m('input', {
                                        className: 'FormControl',
                                        value: this.values.resizeMaxHeight() || 100,
                                        oninput: m.withAttr('value', this.values.resizeMaxHeight),
                                        disabled: !this.values.mustResize()
                                    })
                                ]
                            })
                        ]),
                        m('div', {className: 'ImageUploadPage-imgur', style: {display: (this.values.uploadMethod() === 'imgur' ? "block" : "none")}}, [
                            FieldSet.component({
                                label: app.translator.trans('flagrow-image-upload.admin.labels.imgur.title'),
                                children: [
                                    m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.imgur.client_id')),
                                    m('input', {
                                        className: 'FormControl',
                                        value: this.values.imgurClientId() || '',
                                        oninput: m.withAttr('value', this.values.imgurClientId)
                                    })
                                ]
                            })
                        ]),
                        m('div', {className: 'ImageUploadPage-local', style: {display: (this.values.uploadMethod() === 'local' ? "block" : "none")}}, [
                            FieldSet.component({
                                label: app.translator.trans('flagrow-image-upload.admin.labels.local.title'),
                                children: [
                                    m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.local.cdn_url')),
                                    m('input', {
                                        className: 'FormControl',
                                        value: this.values.cdnUrl() || '',
                                        oninput: m.withAttr('value', this.values.cdnUrl)
                                    }),
                                ]
                            })
                        ]),
                        m('div', {className: 'ImageUploadPage-cloudinary', style: {display: (this.values.uploadMethod() === 'cloudinary' ? "block" : "none")}}, [
                            FieldSet.component({
                                label: app.translator.trans('flagrow-image-upload.admin.labels.cloudinary.title'),
                                children: [
                                    m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.cloudinary.cloud_name')),
                                    m('input', {
                                        className: 'FormControl',
                                        value: this.values.cloudinaryCloudName() || '',
                                        oninput: m.withAttr('value', this.values.cloudinaryCloudName)
                                    }),

                                    m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.cloudinary.api_key')),
                                    m('input', {
                                        className: 'FormControl',
                                        value: this.values.cloudinaryApiKey() || '',
                                        oninput: m.withAttr('value', this.values.cloudinaryApiKey)
                                    }),

                                    m('label', {}, app.translator.trans('flagrow-image-upload.admin.labels.cloudinary.api_secret')),
                                    m('input', {
                                        className: 'FormControl',
                                        value: this.values.cloudinaryApiSecret() || '',
                                        oninput: m.withAttr('value', this.values.cloudinaryApiSecret)
                                    })
                                ]
                            })
                        ]),
                        Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-image-upload.admin.buttons.save'),
                            loading: this.loading,
                            disabled: !this.changed()
                        }),
                    ])
                ])
            ])
        ];
    }

    /**
    * Checks if the values of the fields and checkboxes are different from
    * the ones stored in the database
    *
    * @returns bool
    */
    changed() {
        var fieldsCheck = this.fields.some(key => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
        var checkboxesCheck = this.checkboxes.some(key => this.values[key]() !== (app.data.settings[this.addPrefix(key)] == '1'));
        return fieldsCheck || checkboxesCheck;
    }

    /**
    * Saves the settings to the database and redraw the page
    *
    * @param e
    */
    onsubmit(e) {
        // prevent the usual form submit behaviour
        e.preventDefault();

        // if the page is already saving, do nothing
        if (this.loading) return;

        // prevents multiple savings
        this.loading = true;
        app.alerts.dismiss(this.successAlert);

        const settings = {};

        // gets all the values from the form
        this.fields.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
        this.checkboxes.forEach(key => settings[this.addPrefix(key)] = this.values[key]());

        // actually saves everything in the database
        saveSettings(settings)
            .then(() => {
                // on succes, show an alert
                app.alerts.show(this.successAlert = new Alert({
                    type: 'success',
                    children: app.translator.trans('core.admin.basics.saved_message')
                }));
            })
            .catch(() => {
            })
            .then(() => {
                // return to the initial state and redraw the page
                this.loading = false;
                m.redraw();
            });
    }

    /**
    * Adds the prefix `this.settingsPrefix` at the beginning of `key`
    *
    * @returns string
    */
    addPrefix(key) {
        return this.settingsPrefix + '.' + key;
    }
}
