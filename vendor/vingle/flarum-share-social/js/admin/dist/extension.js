System.register('vingle/share/social/components/ShareSocialSettingsModal', ['flarum/components/SettingsModal'], function (_export) {
  'use strict';

  var SettingsModal, ShareSocialSettingsModal;
  return {
    setters: [function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal['default'];
    }],
    execute: function () {
      ShareSocialSettingsModal = (function (_SettingsModal) {
        babelHelpers.inherits(ShareSocialSettingsModal, _SettingsModal);

        function ShareSocialSettingsModal() {
          babelHelpers.classCallCheck(this, ShareSocialSettingsModal);
          babelHelpers.get(Object.getPrototypeOf(ShareSocialSettingsModal.prototype), 'constructor', this).apply(this, arguments);
        }

        babelHelpers.createClass(ShareSocialSettingsModal, [{
          key: 'className',
          value: function className() {
            return 'Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return 'Share Social Settings';
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
                'Label'
              ),
              m('input', { className: 'FormControl', bidi: this.setting('vingle.share.social') })
            )];
          }
        }]);
        return ShareSocialSettingsModal;
      })(SettingsModal);

      _export('default', ShareSocialSettingsModal);
    }
  };
});;
System.register('vingle/share/social/main', ['flarum/extend', 'flarum/app', 'vingle/share/social/components/ShareSocialSettingsModal'], function (_export) {
  'use strict';

  var extend, app, ShareSocialSettingsModal;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp['default'];
    }, function (_vingleShareSocialComponentsShareSocialSettingsModal) {
      ShareSocialSettingsModal = _vingleShareSocialComponentsShareSocialSettingsModal['default'];
    }],
    execute: function () {

      app.initializers.add('vingle-share-social', function (app) {
        app.extensionSettings['vingle-share-social'] = function () {
          return app.modal.show(new ShareSocialSettingsModal());
        };
      });
    }
  };
});