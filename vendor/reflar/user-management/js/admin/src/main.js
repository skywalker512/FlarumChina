import { extend } from 'flarum/extend';
import addMembersListPane from 'Reflar/UserManagement/addMembersListPane';
import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('Reflar-User-Management', app => {
  addMembersListPane();
  
  extend(PermissionGrid.prototype, 'moderateItems', items => {
    items.add('activate', {
      icon: 'address-card-o',
      label: app.translator.trans('reflar-usermanagement.admin.activate_perm_item'),
      permission: 'user.activate'
    });
    items.add('strike', {
      icon: 'times',
      label: app.translator.trans('reflar-usermanagement.admin.strike_perm_item'),
      permission: 'discussion.strike'
    });
    items.add('viewStrikes', {
      icon: 'eye',
      label: app.translator.trans('reflar-usermanagement.admin.viewstrike_perm_item'),
      permission: 'user.strike'
    });
  });
});