import app from 'flarum/app';
import { extend } from 'flarum/extend';
import SettingsModal from 'flarum/components/SettingsModal';
import Switch from 'flarum/components/Switch';

export default class SecureHttpsSettingsModal extends SettingsModal {
  className() {
    return 'SecureHttpsSettingsModal Modal--small';
  }

  title() {
    return app.translator.trans('davis-securehttps.admin.settings.title');
  }

  form() {
    return [
      <div className="Form-group">
        {Switch.component({
          className: "davis-securehttps-switch",
          state: this.setting('davis-securehttps.proxy')(),
          children: app.translator.trans('davis-securehttps.admin.settings.replace'),
          onchange: this.setting('davis-securehttps.proxy')
        })}
      </div>
    ];
  }
}
