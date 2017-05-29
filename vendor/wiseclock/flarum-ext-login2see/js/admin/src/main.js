import { extend } from 'flarum/extend';
import app from 'flarum/app';

import Login2SeeSettingsModal from 'wiseclock/flarum-ext-login2see/components/Login2SeeSettingsModal';

app.initializers.add('wiseclock-login2see', () =>
{
    app.extensionSettings['wiseclock-login2see'] = () => app.modal.show(new Login2SeeSettingsModal());
});
