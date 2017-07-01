import SettingsModal from 'flarum/components/SettingsModal';

export default class AnalyticsSettingsModal extends SettingsModal {

    className() {
        return 'AnalyticsSettingsModal Modal--small';
    }

    title() {
        return app.translator.trans('flagrow-analytics.admin.popup.title');
    }

    form() {
        // the fields we need to save
        this.fields = [
            'googleTrackingCode',
            'piwikUrl',
            'piwikSiteId',
            'piwikAliasUrl',
            'piwikAuthToken'
        ];

        // the checkboxes we need to save.
        this.checkboxes = [
            'statusGoogle',
            'statusPiwik',
            'piwikTrackSubdomain',
            'piwikPrependDomain',
            'piwikHideAliasUrl'
        ];

        this.inputs = [];
        this.checkbox = [];

        // our package prefix (to be added to every field and checkbox in the setting table)
        this.settingsPrefix = 'flagrow.analytics';

        // the input fields
        this.fields.forEach(key => this.inputs[key] = m('input', {
                id: key,
                className: 'FormControl',
                bidi: this.setting(this.settingsPrefix + '.' + key),
                placeholder: app.translator.trans('flagrow-analytics.admin.popup.field.' + key)
            })
        );

        // the checkboxes
        this.checkboxes.forEach(key => this.checkbox[key] = m('input', {
                id: key,
                type: 'checkbox',
                style: 'float:left; margin-right:3px; margin-top: 2px;',
                bidi: this.setting(this.settingsPrefix + '.' + key)
            })
        );

        // the labels
        this.checkboxes.forEach(key => this.checkbox['label.' + key] = m('div', [
                app.translator.trans('flagrow-analytics.admin.popup.checkbox.label.' + key)
            ])
        );

        return [
            m('div', {className: 'Form-group'}, [
                m('label', [
                    'Google Analytics ',
                    this.checkbox['statusGoogle'],
                ]),
                m('div', {style: {display: ($('#statusGoogle').prop('checked') === true ? "block" : "none")}}, [
                    this.inputs['googleTrackingCode'],
                ]),
                m('br'),

                m('label', [
                    'Piwik ',
                    this.checkbox['statusPiwik']
                ]),
                m('div', {className: 'piwik', style: {display: ($('#statusPiwik').prop('checked') === true ? "block" : "none")}}, [
                    this.inputs['piwikUrl'],
                    m('br'),
                    this.inputs['piwikSiteId'],
                    this.inputs['piwikAuthToken'],
                    m('br'),
                    this.checkbox['piwikTrackSubdomain'],
                    this.checkbox['label.piwikTrackSubdomain'],
                    m('br'),
                    this.checkbox['piwikPrependDomain'],
                    this.checkbox['label.piwikPrependDomain'],
                    m('br'),
                    this.checkbox['piwikHideAliasUrl'],
                    this.checkbox['label.piwikHideAliasUrl'],
                    m('div', {style: {display: ($('#piwikHideAliasUrl').prop('checked') === true ? "block" : "none")}}, [
                        this.inputs['piwikAliasUrl']
                    ]),
                ])
            ])
        ];
    }
}
