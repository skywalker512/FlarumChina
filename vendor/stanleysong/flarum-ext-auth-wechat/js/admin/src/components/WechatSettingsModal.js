import SettingsModal from 'flarum/components/SettingsModal';

export default class WechatSettingsModal extends SettingsModal {
  className() {
    return 'WechatSettingsModal Modal--small';
  }

  title() {
    return app.translator.trans('stanleysong-auth-wechat.admin.wechat_settings.title');
  }

  form() {
    return [
      <div className="Form-group">
        <label>{app.translator.trans('stanleysong-auth-wechat.admin.wechat_settings.app_id_label')}</label>
        <input className="FormControl" bidi={this.setting('stanleysong-auth-wechat.app_id')}/>
      </div>,

      <div className="Form-group">
        <label>{app.translator.trans('stanleysong-auth-wechat.admin.wechat_settings.app_secret_label')}</label>
        <input className="FormControl" bidi={this.setting('stanleysong-auth-wechat.app_secret')}/>
      </div>,

      <div className="Form-group">
        <label>{app.translator.trans('stanleysong-auth-wechat.admin.wechat_settings.app_cburl_label')}</label>
        <input className="FormControl" bidi={this.setting('stanleysong-auth-wechat.callback_url')}/>
      </div>
    ];
  }
}
