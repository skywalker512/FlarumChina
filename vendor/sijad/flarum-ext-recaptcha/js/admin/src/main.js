import app from 'flarum/app';

import ReCaptchaSettingsModal from 'sijad/recaptcha/components/ReCaptchaSettingsModal';

app.initializers.add('sijad-recaptcha', () => {
  app.extensionSettings['sijad-recaptcha'] = () => app.modal.show(new ReCaptchaSettingsModal());
});
