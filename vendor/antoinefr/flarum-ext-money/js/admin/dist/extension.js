System.register('antoinefr/money/components/MoneySettingsModal', ['flarum/components/SettingsModal'], function (_export) {
  'use strict';

  var SettingsModal, MoneySettingsModal;
  return {
    setters: [function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal['default'];
    }],
    execute: function () {
      MoneySettingsModal = (function (_SettingsModal) {
        babelHelpers.inherits(MoneySettingsModal, _SettingsModal);

        function MoneySettingsModal() {
          babelHelpers.classCallCheck(this, MoneySettingsModal);
          babelHelpers.get(Object.getPrototypeOf(MoneySettingsModal.prototype), 'constructor', this).apply(this, arguments);
        }

        babelHelpers.createClass(MoneySettingsModal, [{
          key: 'className',
          value: function className() {
            return 'Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('antoinefr-money.admin.settings.title');
          }
        }, {
          key: 'form',
          value: function form() {
            return [m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                app.translator.trans('antoinefr-money.admin.settings.moneyname')
              ),
              m('input', { required: true, className: 'FormControl', type: 'text', bidi: this.setting('antoinefr-money.moneyname') }),
              m(
                'label',
                null,
                app.translator.trans('antoinefr-money.admin.settings.moneyforpost')
              ),
              m('input', { required: true, className: 'FormControl', type: 'number', step: 'any', bidi: this.setting('antoinefr-money.moneyforpost') }),
              m(
                'label',
                null,
                app.translator.trans('antoinefr-money.admin.settings.moneyfordiscussion')
              ),
              m('input', { required: true, className: 'FormControl', type: 'number', step: 'any', bidi: this.setting('antoinefr-money.moneyfordiscussion') }),
              m(
                'label',
                null,
                app.translator.trans('antoinefr-money.admin.settings.postminimumlength')
              ),
              m('input', { required: true, className: 'FormControl', type: 'number', step: 'any', bidi: this.setting('antoinefr-money.postminimumlength') })
            )];
          }
        }]);
        return MoneySettingsModal;
      })(SettingsModal);

      _export('default', MoneySettingsModal);
    }
  };
});;
System.register('antoinefr/money/main', ['flarum/extend', 'antoinefr/money/components/MoneySettingsModal', 'flarum/components/PermissionGrid'], function (_export) {
  'use strict';

  var extend, MoneySettingsModal, PermissionGrid;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_antoinefrMoneyComponentsMoneySettingsModal) {
      MoneySettingsModal = _antoinefrMoneyComponentsMoneySettingsModal['default'];
    }, function (_flarumComponentsPermissionGrid) {
      PermissionGrid = _flarumComponentsPermissionGrid['default'];
    }],
    execute: function () {

      app.initializers.add('antoinefr-money', function () {
        app.extensionSettings['antoinefr-money'] = function () {
          app.modal.show(new MoneySettingsModal());
        };

        extend(PermissionGrid.prototype, 'moderateItems', function (items) {
          items.add('editMoney', {
            icon: 'money',
            label: app.translator.trans('antoinefr-money.admin.permissions.edit_money_label'),
            permission: 'user.edit_money'
          });
        });
      });
    }
  };
});