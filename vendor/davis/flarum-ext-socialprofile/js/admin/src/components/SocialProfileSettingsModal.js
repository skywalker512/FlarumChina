import SettingsModal from 'flarum/components/SettingsModal';

export default class SocialProfileSettingsModal extends SettingsModal {
  className() {
    return 'SocialProfileSettingsModal Modal--small';
  }

  title() {
    return app.translator.trans('davis-socialprofile.admin.test');
  }

  form() {
    return (
      <div className="Form-group">
        <label htmlFor="test">{app.translator.trans('davis-socialprofile.admin.test')}</label>
        <input name="test" type="text" className="FormControl" bidi={this.setting('davis.socialprofile.test')} />
      </div>
    );
  }
}
