import SettingsModal from 'flarum/components/SettingsModal';

export default class InviteOnlySettingsModal extends SettingsModal {
  init() {
    super.init();
    
    if (this.setting('davis-inviteonly.maximumkeys') == undefined || this.setting('davis-inviteonly.maximumkeys')() == "") {
      this.setting('davis-inviteonly.maximumkeys')(5);
    }
  }
  className() {
    return 'InviteOnlySettingsModal Modal--small';
  }

  title() {
    return app.translator.trans('davis-inviteonly.admin.settings.title');
  }

  form() {
    return [
      <div className="Form-group">
        <label>{app.translator.trans('davis-inviteonly.admin.settings.maximumkeys')}</label>
        <input required className="FormControl" type="number" bidi={this.setting('davis-inviteonly.maximumkeys')}/>
      </div>
    ];
  }
}