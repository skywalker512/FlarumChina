import { extend } from 'flarum/extend';
import app from 'flarum/app';

import PostCopyrightSettingsModal from 'wiseclock/flarum-ext-post-copyright/components/PostCopyrightSettingsModal';

app.initializers.add('wiseclock-post-copyright', () =>
{
    app.extensionSettings['wiseclock-post-copyright'] = () => app.modal.show(new PostCopyrightSettingsModal());
});
