import SettingsModal from 'flarum/components/SettingsModal';

export default class ShareSocialSettingsModal extends SettingsModal {
  className() {
    return 'Modal--small';
  }

  title() {
    return 'Share Social Settings';
  }

  form() {
    return [
    <div className="Form-group">
    <label>Label</label>
    <input className="FormControl" bidi={this.setting('vingle.share.social')}/>
    </div>
    ];
  }
}