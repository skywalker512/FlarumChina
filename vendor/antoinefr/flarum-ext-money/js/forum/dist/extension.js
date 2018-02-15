System.register('antoinefr/money/components/UserMoneyModal', ['flarum/components/Modal', 'flarum/components/Button'], function (_export) {
  'use strict';

  var Modal, Button, UserMoneyModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal['default'];
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton['default'];
    }],
    execute: function () {
      UserMoneyModal = (function (_Modal) {
        babelHelpers.inherits(UserMoneyModal, _Modal);

        function UserMoneyModal() {
          babelHelpers.classCallCheck(this, UserMoneyModal);
          babelHelpers.get(Object.getPrototypeOf(UserMoneyModal.prototype), 'constructor', this).apply(this, arguments);
        }

        babelHelpers.createClass(UserMoneyModal, [{
          key: 'init',
          value: function init() {
            babelHelpers.get(Object.getPrototypeOf(UserMoneyModal.prototype), 'init', this).call(this);
            this.money = m.prop(this.props.user.data.attributes['money']);
          }
        }, {
          key: 'className',
          value: function className() {
            return 'UserMoneyModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('antoinefr-money.forum.modal.title', { user: this.props.user });
          }
        }, {
          key: 'content',
          value: function content() {
            return m(
              'div',
              { className: 'Modal-body' },
              m(
                'div',
                { className: 'Form' },
                m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    'label',
                    null,
                    app.translator.trans('antoinefr-money.forum.modal.current'),
                    ' ',
                    app.forum.data.attributes['antoinefr-money.moneyname'].replace('{money}', this.props.user.data.attributes['money'])
                  ),
                  m('input', { required: true, className: 'FormControl', type: 'number', step: 'any', value: this.money(), oninput: m.withAttr('value', this.money) })
                ),
                m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    Button,
                    { className: 'Button Button--primary', loading: this.loading, type: 'submit' },
                    app.translator.trans('antoinefr-money.forum.modal.submit_button')
                  )
                )
              )
            );
          }
        }, {
          key: 'onsubmit',
          value: function onsubmit(e) {
            var _this = this;

            e.preventDefault();

            this.loading = true;

            this.props.user.save({ 'money': this.money() }).then(function () {
              return _this.hide();
            }, this.loaded.bind(this));
          }
        }]);
        return UserMoneyModal;
      })(Modal);

      _export('default', UserMoneyModal);
    }
  };
});;
System.register('antoinefr/money/main', ['flarum/extend', 'flarum/components/UserCard', 'flarum/utils/UserControls', 'flarum/components/Button', 'antoinefr/money/components/UserMoneyModal', 'flarum/Model', 'flarum/models/User'], function (_export) {
  'use strict';

  var extend, UserCard, UserControls, Button, UserMoneyModal, Model, User;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsUserCard) {
      UserCard = _flarumComponentsUserCard['default'];
    }, function (_flarumUtilsUserControls) {
      UserControls = _flarumUtilsUserControls['default'];
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton['default'];
    }, function (_antoinefrMoneyComponentsUserMoneyModal) {
      UserMoneyModal = _antoinefrMoneyComponentsUserMoneyModal['default'];
    }, function (_flarumModel) {
      Model = _flarumModel['default'];
    }, function (_flarumModelsUser) {
      User = _flarumModelsUser['default'];
    }],
    execute: function () {

      app.initializers.add('antoinefr-money', function () {
        User.prototype.canEditMoney = Model.attribute('canEditMoney');

        extend(UserCard.prototype, 'infoItems', function (items) {
          items.add('money', app.forum.data.attributes['antoinefr-money.moneyname'].replace('{money}', this.props.user.data.attributes['money']));
        });

        extend(UserControls, 'moderationControls', function (items, user) {
          if (user.canEditMoney()) {
            items.add('money', Button.component({
              children: app.translator.trans('antoinefr-money.forum.user_controls.money_button'),
              icon: 'money',
              onclick: function onclick() {
                app.modal.show(new UserMoneyModal({ user: user }));
              }
            }));
          }
        });
      });
    }
  };
});