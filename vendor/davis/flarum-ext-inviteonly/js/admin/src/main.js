import app from 'flarum/app';
import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';
import InviteOnlySettingsModal from 'Davis/InviteOnly/components/InviteOnlySettingsModal';

app.initializers.add('Davis-inviteonly', () => {
  app.extensionSettings['davis-inviteonly'] = () => app.modal.show(new InviteOnlySettingsModal());
  extend(PermissionGrid.prototype, 'startItems', items => {
    items.add('davis-createKey', {
      icon: 'plus',
      label: app.translator.trans('davis-inviteonly.admin.settings.title'),
      permission: 'davis-inviteonly.createkey'
    });
  });
});