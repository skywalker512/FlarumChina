import SettingsModal from 'flarum/components/SettingsModal';

export default class GithubSettingsModal extends SettingsModal {
  className() {
    return 'GithubSettingsModal Modal--small';
  }

  title() {
    return 'GitHub Settings';
  }

  form() {
    return [
      <div className="Form-group">
        <label>Client ID</label>
        <input className="FormControl" bidi={this.setting('flarum-auth-github.client_id')}/>
      </div>,

      <div className="Form-group">
        <label>Client Secret</label>
        <input className="FormControl" bidi={this.setting('flarum-auth-github.client_secret')}/>
      </div>
    ];
  }
}
