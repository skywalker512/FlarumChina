'use strict';

System.register('Davis/SocialProfile/components/SocialProfileSettingsModal', ['flarum/components/SettingsModal'], function (_export, _context) {
  "use strict";

  var SettingsModal, SocialProfileSettingsModal;
  return {
    setters: [function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal.default;
    }],
    execute: function () {
      SocialProfileSettingsModal = function (_SettingsModal) {
        babelHelpers.inherits(SocialProfileSettingsModal, _SettingsModal);

        function SocialProfileSettingsModal() {
          babelHelpers.classCallCheck(this, SocialProfileSettingsModal);
          return babelHelpers.possibleConstructorReturn(this, (SocialProfileSettingsModal.__proto__ || Object.getPrototypeOf(SocialProfileSettingsModal)).apply(this, arguments));
        }

        babelHelpers.createClass(SocialProfileSettingsModal, [{
          key: 'className',
          value: function className() {
            return 'SocialProfileSettingsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('davis-socialprofile.admin.test');
          }
        }, {
          key: 'form',
          value: function form() {
            return m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                { htmlFor: 'test' },
                app.translator.trans('davis-socialprofile.admin.test')
              ),
              m('input', { name: 'test', type: 'text', className: 'FormControl', bidi: this.setting('davis.socialprofile.test') })
            );
          }
        }]);
        return SocialProfileSettingsModal;
      }(SettingsModal);

      _export('default', SocialProfileSettingsModal);
    }
  };
});;
'use strict';

System.register('Davis/SocialProfile/main', ['flarum/app'], function (_export, _context) {
  "use strict";

  var app;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }],
    execute: function () {

      app.initializers.add('Davis-SocialProfile', function () {});
    }
  };
});