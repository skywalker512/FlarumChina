import app from 'flarum/app';

import WechatSettingsModal from 'stanleysong/auth/wechat/components/WechatSettingsModal';

app.initializers.add('stanleysong-auth-wechat', () => {
  app.extensionSettings['stanleysong-auth-wechat'] = () => app.modal.show(new WechatSettingsModal());
});
