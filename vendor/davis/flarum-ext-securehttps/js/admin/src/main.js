import app from 'flarum/app';
import { extend } from 'flarum/extend';
import SecureHttpsSettingsModal from 'Davis/SecureHttps/components/SecureHttpsSettingsModal';

app.initializers.add('Davis-SecureHttps', app => {
  app.extensionSettings['davis-securehttps'] = () => app.modal.show(new SecureHttpsSettingsModal());
});
