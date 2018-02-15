import { extend } from 'flarum/extend';
import UserCard from 'flarum/components/UserCard';
import UserControls from 'flarum/utils/UserControls';
import Button from 'flarum/components/Button';
import UserMoneyModal from 'antoinefr/money/components/UserMoneyModal';
import Model from 'flarum/Model';
import User from 'flarum/models/User';

app.initializers.add('antoinefr-money', function() {
  User.prototype.canEditMoney = Model.attribute('canEditMoney');
  
  extend(UserCard.prototype, 'infoItems', function(items) {
    items.add('money',
      app.forum.data.attributes['antoinefr-money.moneyname'].replace('{money}', this.props.user.data.attributes['money'])
    );
  });
  
  extend(UserControls, 'moderationControls', function(items, user) {
    if (user.canEditMoney()) {
      items.add('money', Button.component({
        children: app.translator.trans('antoinefr-money.forum.user_controls.money_button'),
        icon: 'money',
        onclick: function() {
          app.modal.show(new UserMoneyModal({user}));
        }
      }));
    }
  });
  
});
