import app from 'flarum/app';

import QqSettingsModal from 'lazyboywu/auth/qq/components/QqSettingsModal';

app.initializers.add('lazyboywu-auth-qq', () => {
  app.extensionSettings['lazyboywu-auth-qq'] = () => app.modal.show(new QqSettingsModal());
});
