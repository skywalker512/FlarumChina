import SettingsModal from 'flarum/components/SettingsModal';

export default class TwitterSettingsModal extends SettingsModal {
  className() {
    return 'TwitterSettingsModal Modal--small';
  }

  title() {
    return 'Twitter Settings';
  }

  form() {
    return [
      <div className="Form-group">
        <label>API Key</label>
        <input className="FormControl" bidi={this.setting('flarum-auth-twitter.api_key')}/>
      </div>,

      <div className="Form-group">
        <label>API Secret</label>
        <input className="FormControl" bidi={this.setting('flarum-auth-twitter.api_secret')}/>
      </div>
    ];
  }
}
