import { extend } from 'flarum/extend';
import MoneySettingsModal from 'antoinefr/money/components/MoneySettingsModal';
import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('antoinefr-money', function() {
  app.extensionSettings['antoinefr-money'] = function() {
    app.modal.show(new MoneySettingsModal());
  }
  
  extend(PermissionGrid.prototype, 'moderateItems', items => {
    items.add('editMoney', {
      icon: 'money',
      label: app.translator.trans('antoinefr-money.admin.permissions.edit_money_label'),
      permission: 'user.edit_money'
    });
  });
});