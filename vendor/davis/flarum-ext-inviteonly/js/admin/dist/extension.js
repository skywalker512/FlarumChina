'use strict';

System.register('Davis/InviteOnly/components/InviteOnlySettingsModal', ['flarum/components/SettingsModal'], function (_export, _context) {
  var SettingsModal, InviteOnlySettingsModal;
  return {
    setters: [function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal.default;
    }],
    execute: function () {
      InviteOnlySettingsModal = function (_SettingsModal) {
        babelHelpers.inherits(InviteOnlySettingsModal, _SettingsModal);

        function InviteOnlySettingsModal() {
          babelHelpers.classCallCheck(this, InviteOnlySettingsModal);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(InviteOnlySettingsModal).apply(this, arguments));
        }

        babelHelpers.createClass(InviteOnlySettingsModal, [{
          key: 'init',
          value: function init() {
            babelHelpers.get(Object.getPrototypeOf(InviteOnlySettingsModal.prototype), 'init', this).call(this);

            if (this.setting('davis-inviteonly.maximumkeys') == undefined || this.setting('davis-inviteonly.maximumkeys')() == "") {
              this.setting('davis-inviteonly.maximumkeys')(5);
            }
          }
        }, {
          key: 'className',
          value: function className() {
            return 'InviteOnlySettingsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('davis-inviteonly.admin.settings.title');
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
                app.translator.trans('davis-inviteonly.admin.settings.maximumkeys')
              ),
              m('input', { required: true, className: 'FormControl', type: 'number', bidi: this.setting('davis-inviteonly.maximumkeys') })
            )];
          }
        }]);
        return InviteOnlySettingsModal;
      }(SettingsModal);

      _export('default', InviteOnlySettingsModal);
    }
  };
});;
'use strict';

System.register('Davis/InviteOnly/main', ['flarum/app', 'flarum/extend', 'flarum/components/PermissionGrid', 'Davis/InviteOnly/components/InviteOnlySettingsModal'], function (_export, _context) {
  var app, extend, PermissionGrid, InviteOnlySettingsModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsPermissionGrid) {
      PermissionGrid = _flarumComponentsPermissionGrid.default;
    }, function (_DavisInviteOnlyComponentsInviteOnlySettingsModal) {
      InviteOnlySettingsModal = _DavisInviteOnlyComponentsInviteOnlySettingsModal.default;
    }],
    execute: function () {

      app.initializers.add('Davis-inviteonly', function () {
        app.extensionSettings['davis-inviteonly'] = function () {
          return app.modal.show(new InviteOnlySettingsModal());
        };
        extend(PermissionGrid.prototype, 'startItems', function (items) {
          items.add('davis-createKey', {
            icon: 'plus',
            label: app.translator.trans('davis-inviteonly.admin.settings.title'),
            permission: 'davis-inviteonly.createkey'
          });
        });
      });
    }
  };
});