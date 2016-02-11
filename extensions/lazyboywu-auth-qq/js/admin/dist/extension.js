System.register('lazyboywu/auth/qq/components/QqSettingsModal', ['flarum/components/SettingsModal'], function (_export) {
  'use strict';

  var SettingsModal, QqSettingsModal;
  return {
    setters: [function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal['default'];
    }],
    execute: function () {
      QqSettingsModal = (function (_SettingsModal) {
        babelHelpers.inherits(QqSettingsModal, _SettingsModal);

        function QqSettingsModal() {
          babelHelpers.classCallCheck(this, QqSettingsModal);
          babelHelpers.get(Object.getPrototypeOf(QqSettingsModal.prototype), 'constructor', this).apply(this, arguments);
        }

        babelHelpers.createClass(QqSettingsModal, [{
          key: 'className',
          value: function className() {
            return 'QqSettingsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return 'Qq Settings';
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
                'Client ID'
              ),
              m('input', { className: 'FormControl', bidi: this.setting('lazyboywu-auth-qq.client_id') })
            ), m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                'Client Secret'
              ),
              m('input', { className: 'FormControl', bidi: this.setting('lazyboywu-auth-qq.client_secret') })
            )];
          }
        }]);
        return QqSettingsModal;
      })(SettingsModal);

      _export('default', QqSettingsModal);
    }
  };
});;
System.register('lazyboywu/auth/qq/main', ['flarum/app', 'lazyboywu/auth/qq/components/QqSettingsModal'], function (_export) {
  'use strict';

  var app, QqSettingsModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp['default'];
    }, function (_lazyboywuAuthQqComponentsQqSettingsModal) {
      QqSettingsModal = _lazyboywuAuthQqComponentsQqSettingsModal['default'];
    }],
    execute: function () {

      app.initializers.add('lazyboywu-auth-qq', function () {
        app.extensionSettings['lazyboywu-auth-qq'] = function () {
          return app.modal.show(new QqSettingsModal());
        };
      });
    }
  };
});
