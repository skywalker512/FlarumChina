import SettingsModal from 'flarum/components/SettingsModal';

export default class AnimatedTagSettingsModal extends SettingsModal {
  className() {
    return 'AnimatedTagSettingsModal Modal--small';
  }

  title() {
    return app.translator.trans('davis-socialprofile.admin.test');
  }

  form() {
    return [
      <div className="Form-group">
        <label>{app.translator.trans('davis-socialprofile.admin.test')}</label>
        <input type="text" className="FormControl" bidi={this.setting('davis.socialprofile.test')}></input>
      </div>
    ];
  }
}
