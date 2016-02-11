import SettingsModal from 'flarum/components/SettingsModal';

export default class FacebookSettingsModal extends SettingsModal {
  className() {
    return 'FacebookSettingsModal Modal--small';
  }

  title() {
    return 'Facebook Settings';
  }

  form() {
    return [
      <div className="Form-group">
        <label>App ID</label>
        <input className="FormControl" bidi={this.setting('flarum-auth-facebook.app_id')}/>
      </div>,

      <div className="Form-group">
        <label>App Secret</label>
        <input className="FormControl" bidi={this.setting('flarum-auth-facebook.app_secret')}/>
      </div>
    ];
  }
}
