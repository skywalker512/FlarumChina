import { extend } from 'flarum/extend';
import app from 'flarum/app';

import ShareSocialSettingsModal from 'vingle/share/social/components/ShareSocialSettingsModal';

app.initializers.add('vingle-share-social', app => {
  app.extensionSettings['vingle-share-social'] = () => app.modal.show(new ShareSocialSettingsModal()); 
});
