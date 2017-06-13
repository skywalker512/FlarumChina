'use strict';

System.register('Davis/InviteOnly/main', ['flarum/extend', 'flarum/app', 'flarum/components/SignUpModal', 'flarum/utils/extractText', 'flarum/components/LogInButtons', 'flarum/components/Button', 'flarum/components/SettingsPage', 'Davis/InviteOnly/components/InviteModal', 'flarum/components/FieldSet'], function (_export, _context) {
  var extend, app, SignUpModal, extractText, LogInButtons, Button, SettingsPage, InviteModal, FieldSet;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponentsSignUpModal) {
      SignUpModal = _flarumComponentsSignUpModal.default;
    }, function (_flarumUtilsExtractText) {
      extractText = _flarumUtilsExtractText.default;
    }, function (_flarumComponentsLogInButtons) {
      LogInButtons = _flarumComponentsLogInButtons.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumComponentsSettingsPage) {
      SettingsPage = _flarumComponentsSettingsPage.default;
    }, function (_DavisInviteOnlyComponentsInviteModal) {
      InviteModal = _DavisInviteOnlyComponentsInviteModal.default;
    }, function (_flarumComponentsFieldSet) {
      FieldSet = _flarumComponentsFieldSet.default;
    }],
    execute: function () {

      app.initializers.add('davis-inviteonly', function () {
        SignUpModal.prototype.body = function () {
          return [this.props.token ? '' : m(LogInButtons, null), m(
            'div',
            { className: 'Form Form--centered' },
            m(
              'div',
              { className: 'Form-group' },
              m('input', { className: 'FormControl', name: 'username', type: 'text', placeholder: extractText(app.translator.trans('core.forum.sign_up.username_placeholder')),
                value: this.username(),
                onchange: m.withAttr('value', this.username),
                disabled: this.loading })
            ),
            m(
              'div',
              { className: 'Form-group' },
              m('input', { className: 'FormControl', name: 'email', type: 'email', placeholder: extractText(app.translator.trans('core.forum.sign_up.email_placeholder')),
                value: this.email(),
                onchange: m.withAttr('value', this.email),
                disabled: this.loading || this.props.token && this.props.email })
            ),
            this.props.token ? '' : m(
              'div',
              { className: 'Form-group' },
              m('input', { className: 'FormControl', name: 'password', type: 'password', placeholder: extractText(app.translator.trans('core.forum.sign_up.password_placeholder')),
                value: this.password(),
                onchange: m.withAttr('value', this.password),
                disabled: this.loading })
            ),
            m(
              'div',
              { className: 'Form-group' },
              m('input', { className: 'FormControl', name: 'referal', type: 'text', placeholder: extractText(app.translator.trans('davis-inviteonly.forum.sign_up.referal_placeholder')),
                value: this.referal(),
                onchange: m.withAttr('value', this.referal),
                disabled: this.loading })
            ),
            m(
              'div',
              { className: 'Form-group' },
              m(
                Button,
                {
                  className: 'Button Button--primary Button--block',
                  type: 'submit',
                  loading: this.loading },
                app.translator.trans('core.forum.sign_up.submit_button')
              )
            )
          )];
        };
        SignUpModal.prototype.submitData = function () {
          var data = {
            username: this.username(),
            email: this.email(),
            referal: this.referal()
          };

          if (this.props.token) {
            data.token = this.props.token;
          } else {
            data.password = this.password();
          }

          if (this.props.avatarUrl) {
            data.avatarUrl = this.props.avatarUrl;
          }

          return data;
        };
        SignUpModal.prototype.init = function () {
          this.username = m.prop(this.props.username || '');

          this.email = m.prop(this.props.email || '');

          this.password = m.prop(this.props.password || '');

          this.referal = m.prop(this.props.referal || '');
        };
        SignUpModal.prototype.onsubmit = function (e) {
          e.preventDefault();

          this.loading = true;

          var data = this.submitData();

          app.request({
            url: app.forum.attribute('baseUrl') + '/api/davis/inviteonly/register',
            method: 'POST',
            data: data,
            errorHandler: this.onerror.bind(this)
          }).then(function () {
            return window.location.reload();
          }, this.loaded.bind(this));
        };
        extend(SettingsPage.prototype, 'settingsItems', function (items) {
          var _this = this;

          if (this.codes == undefined) {
            app.request({
              method: 'GET',
              url: app.forum.attribute('apiUrl') + '/davis/inviteonly/' + app.current.user.data.id
            }).then(function (response) {
              _this.codes = response.data.attributes;
              _this.flatcodes = [];
              for (var k in _this.codes) {
                _this.flatcodes[k] = [];
                _this.flatcodes[k]['index'] = k;
                _this.flatcodes[k]['id'] = _this.codes[k]['id'];
                _this.flatcodes[k]['token'] = _this.codes[k]['token'];
                _this.flatcodes[k]['used'] = _this.codes[k]['used'];
                _this.flatcodes[k]['used_by'] = _this.codes[k]['used_by'];
              }
              m.redraw();
              _this.loading = false;
              _this.handleErrors(response);
            });
          }
          items.add('invite', FieldSet.component({
            label: app.translator.trans('davis-inviteonly.forum.edit.title'),
            className: 'Settings-invite',
            children: [m('table', { className: "NotificationGrid" }, [m('thead', [m('tr', [m('td', [app.translator.trans('davis-inviteonly.forum.edit.key')]), m('td', [app.translator.trans('davis-inviteonly.forum.edit.used')]), m('td', [app.translator.trans('davis-inviteonly.forum.edit.used_by')]), m('td')])]), m('tbody', [this.flatcodes !== undefined ? this.flatcodes.map(function (code) {
              return [m('tr', [m('td', [code['token']]), m('td', [code['used']]), m('td', [m('a', { href: app.forum.attribute('baseUrl') + '/u/' + code['used_by'] }, [code['used_by']])]), m('td', [m('a', { onclick: function onclick() {
                  _this.createToken(code['id'], code['index']);
                } }, ["Regenerate"])])])];
            }) : m('tr', [m('td', [app.translator.trans('davis-inviteonly.forum.loading')])]), m('tr', [m('td', { colspan: 4 }, [Button.component({ className: "Button Button--primary Button--block", onclick: function onclick() {
                _this.createToken(0, _this.flatcodes.length);
              } }, ["Create New Code"])])])])])]
          }), 1);
        });
        SettingsPage.prototype.createToken = function (id, index) {
          var _this2 = this;

          var data = new FormData();
          data.append('refid', id);
          app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/davis/inviteonly/create',
            serialize: function serialize(raw) {
              return raw;
            },
            data: data
          }).then(function (response) {
            _this2.flatcodes[index] = [];
            _this2.flatcodes[index]['index'] = index;
            _this2.flatcodes[index]['id'] = response.data.attributes['id'];
            _this2.flatcodes[index]['token'] = response.data.attributes['token'];
            _this2.flatcodes[index]['used'] = response.data.attributes['used'];
            _this2.flatcodes[index]['used_by'] = response.data.attributes['used_by'];
            m.redraw();
            _this2.loading = false;
            _this2.handleErrors(response);
          });
        };
      });
    }
  };
});