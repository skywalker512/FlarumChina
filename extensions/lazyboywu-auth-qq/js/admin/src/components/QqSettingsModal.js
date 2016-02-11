import SettingsModal from 'flarum/components/SettingsModal';

export default class QqSettingsModal extends SettingsModal {
  className() {
    return 'QqSettingsModal Modal--small';
  }

  title() {
    return 'Qq Settings';
  }

  form() {
    return [
      <div className="Form-group">
        <label>Client ID</label>
        <input className="FormControl" bidi={this.setting('lazyboywu-auth-qq.client_id')}/>
      </div>,

      <div className="Form-group">
        <label>Client Secret</label>
        <input className="FormControl" bidi={this.setting('lazyboywu-auth-qq.client_secret')}/>
      </div>
    ];
  }
}
