import { extend } from 'flarum/extend';
import app from 'flarum/app';
import SocialProfileSettingsModal from 'Davis/SocialProfile/components/SocialProfileSettingsModal';

app.initializers.add('Davis-SocialProfile', app => {
  //app.extensionSettings['davis-socialprofile'] = () => app.modal.show(new SocialProfileSettingsModal());
});
