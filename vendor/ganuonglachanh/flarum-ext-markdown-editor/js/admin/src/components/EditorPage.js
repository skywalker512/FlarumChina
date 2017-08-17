import Component from "flarum/Component";
import Button from "flarum/components/Button";
import saveSettings from "flarum/utils/saveSettings";
import Alert from "flarum/components/Alert";
import Select from "flarum/components/Select";
import Switch from "flarum/components/Switch";

export default class EditorPage extends Component {

    init() {
        // whether we are saving the settings or not right now
        this.loading = false;

        // the fields we need to watch and to save
        this.fields = [
            'symbols',
        ];

        this.values = {};

        // our package prefix (to be added to every field and checkbox in the setting table)
        this.settingsPrefix = 'ganuonglachanh.mdeditor';

        // get the saved settings from the database
        const settings = app.data.settings;

        // bind the values of the fields and checkboxes to the getter/setter functions
        this.fields.forEach(key =>
            this.values[key] = m.prop(settings[this.addPrefix(key)])
        );
    }

    /**
     * Show the actual EditorPage.
     *
     * @returns {*}
     */
    view() {
        return <div className='EditorPage'>
            <div className='container'>
                <form onsubmit={this.onsubmit.bind(this)}>
                    <fieldset className='EditorPage-preferences'>
                        <legend>{app.translator.trans('ganuonglachanh-mdeditor.admin.labels.preferences.title')}</legend>
                        <label>{app.translator.trans('ganuonglachanh-mdeditor.admin.labels.preferences.symbols')}</label>
                        <textarea className='FormControl'
                            value={this.values.symbols() || ''}
                            oninput={m.withAttr('value', this.values.symbols)} />
                    </fieldset>
                    {Button.component({
                        type: 'submit',
                        className: 'Button Button--primary',
                        children: app.translator.trans('ganuonglachanh-mdeditor.admin.buttons.save'),
                        loading: this.loading,
                        disabled: !this.changed()
                    })}
                </form>
            </div>
        </div>
    }


    /**
     * Checks if the values of the fields and checkboxes are different from
     * the ones stored in the database
     *
     * @returns boolean
     */
    changed() {
        var fieldsCheck = this.fields.some(key => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
        return fieldsCheck;
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

        // remove previous success popup
        app.alerts.dismiss(this.successAlert);

        const settings = {};

        // gets all the values from the form
        this.fields.forEach(key => settings[this.addPrefix(key)] = this.values[key]());

        // actually saves everything in the database
        saveSettings(settings)
            .then(() => {
                // on success, show popup
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
