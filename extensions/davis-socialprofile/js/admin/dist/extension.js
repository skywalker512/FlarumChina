System.register('davis/socialprofile/components/SocialProfileSettingsModal', ['flarum/components/SettingsModal'], function (_export) {
  'use strict';

  var SettingsModal, AnimatedTagSettingsModal;
  return {
    setters: [function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal['default'];
    }],
    execute: function () {
      AnimatedTagSettingsModal = (function (_SettingsModal) {
        babelHelpers.inherits(AnimatedTagSettingsModal, _SettingsModal);

        function AnimatedTagSettingsModal() {
          babelHelpers.classCallCheck(this, AnimatedTagSettingsModal);
          babelHelpers.get(Object.getPrototypeOf(AnimatedTagSettingsModal.prototype), 'constructor', this).apply(this, arguments);
        }

        babelHelpers.createClass(AnimatedTagSettingsModal, [{
          key: 'className',
          value: function className() {
            return 'AnimatedTagSettingsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('davis-socialprofile.admin.test');
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
                app.translator.trans('davis-socialprofile.admin.test')
              ),
              m('input', { type: 'text', className: 'FormControl', bidi: this.setting('davis.socialprofile.test') })
            )];
          }
        }]);
        return AnimatedTagSettingsModal;
      })(SettingsModal);

      _export('default', AnimatedTagSettingsModal);
    }
  };
});;
System.register('davis/socialprofile/main', ['flarum/extend', 'flarum/app', 'davis/socialprofile/components/SocialProfileSettingsModal'], function (_export) {
  'use strict';

  var extend, app, SocialProfileSettingsModal;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp['default'];
    }, function (_davisSocialprofileComponentsSocialProfileSettingsModal) {
      SocialProfileSettingsModal = _davisSocialprofileComponentsSocialProfileSettingsModal['default'];
    }],
    execute: function () {

      app.initializers.add('davis-socialprofile', function (app) {
        //app.extensionSettings['davis-socialprofile'] = () => app.modal.show(new SocialProfileSettingsModal());
      });
    }
  };
});