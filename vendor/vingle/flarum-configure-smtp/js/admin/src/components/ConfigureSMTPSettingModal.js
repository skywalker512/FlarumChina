import SettingsModal from 'flarum/components/SettingsModal';

export default class ConfigureSMTPSettingModal extends SettingsModal {

    className() {
        return 'Modal--small';
    }

    title() {
        return 'SMTP Settings';
    }

    form() {
        return [
            <div className = "Form-group">
                <label> Mail Driver </label>
                <select className = "FormControl" bidi = {this.setting('mail_driver')}>
                    <option value='smtp'>smtp</option>
                    <option value='mail'>mail</option>
                </select>
                smtp
            </div>,

            <div className = "Form-group">
                <label> Mail Encryption </label>
                <input
                    className = "FormControl"
                    bidi = {this.setting('mail_encryption')}
                />
                null
            </div>,

            <div className = "Form-group">
                <label> Mail Port </label> <input className = "FormControl"
                    type = "number"
                    min = "0"
                    bidi = {this.setting('mail_port')}
                />
                25
            </div>,

            <div className = "Form-group">
                <label> Mail Host </label>
                <input
                    className = "FormControl"
                    bidi = {this.setting('mail_host')}
                />
                smtp.flarum.org
            </div>,

            <div className = "Form-group">
                <label> Mail Username </label>
                <input
                    className = "FormControl"
                    bidi = {this.setting('mail_username')}
                />
                smtp@flarum.org
            </div>,

            <div className = "Form-group">
                <label> Mail Password </label>
                <input
                    type = "password"
                    className = "FormControl"
                    bidi = {this.setting('mail_password')}
                />
                password
            </div>,

            <div className = "Form-group">
                <label> Mail From </label>
                <input
                    className = "FormControl"
                    bidi = {this.setting('mail_from')}
                />
                smtp@flarum.org
            </div>
        ];
    }
}
