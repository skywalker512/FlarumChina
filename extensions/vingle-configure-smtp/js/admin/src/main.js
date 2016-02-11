import app from 'flarum/app';

import ConfigureSMTPSettingModal from 'vingle/configure/smtp/components/ConfigureSMTPSettingModal';

app.initializers.add('vingle-configure-smtp', () => {
  app.extensionSettings['vingle-configure-smtp'] = () => app.modal.show(new ConfigureSMTPSettingModal());
});
