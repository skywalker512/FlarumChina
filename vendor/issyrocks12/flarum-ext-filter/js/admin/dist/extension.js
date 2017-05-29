'use strict';

System.register('issyrocks12/filter/addWordPane', ['flarum/app', 'flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'issyrocks12/filter/components/WordConfigPage'], function (_export, _context) {
    "use strict";

    var app, extend, AdminNav, AdminLinkButton, WordConfigPage;

    _export('default', function () {
        app.routes['issyrocks12-filter'] = { path: '/filter', component: WordConfigPage.component() };

        app.extensionSettings['issyrocks12-filter'] = function () {
            return m.route(app.route('issyrocks12-filter'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            items.add('issyrocks12-filter', AdminLinkButton.component({
                href: app.route('issyrocks12-filter'),
                icon: 'filter',
                children: app.translator.trans('issyrocks12-filter.admin.nav.text'),
                description: app.translator.trans('issyrocks12-filter.admin.nav.desc')
            }));
        });
    });

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_issyrocks12FilterComponentsWordConfigPage) {
            WordConfigPage = _issyrocks12FilterComponentsWordConfigPage.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("issyrocks12/filter/components/WordConfigPage", ["flarum/Component", "flarum/components/Button", "flarum/utils/saveSettings", "flarum/components/Switch", "flarum/components/Alert", "flarum/components/FieldSet"], function (_export, _context) {
  "use strict";

  var Component, Button, saveSettings, Switch, Alert, FieldSet, WordConfigPage;
  return {
    setters: [function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumUtilsSaveSettings) {
      saveSettings = _flarumUtilsSaveSettings.default;
    }, function (_flarumComponentsSwitch) {
      Switch = _flarumComponentsSwitch.default;
    }, function (_flarumComponentsAlert) {
      Alert = _flarumComponentsAlert.default;
    }, function (_flarumComponentsFieldSet) {
      FieldSet = _flarumComponentsFieldSet.default;
    }],
    execute: function () {
      WordConfigPage = function (_Component) {
        babelHelpers.inherits(WordConfigPage, _Component);

        function WordConfigPage() {
          babelHelpers.classCallCheck(this, WordConfigPage);
          return babelHelpers.possibleConstructorReturn(this, (WordConfigPage.__proto__ || Object.getPrototypeOf(WordConfigPage)).apply(this, arguments));
        }

        babelHelpers.createClass(WordConfigPage, [{
          key: "init",
          value: function init() {
            var _this2 = this;

            var settings = app.data.settings;

            this.fields = ['Words', 'flaggedEmail', 'flaggedSubject'];

            this.values = {};

            this.autoMergePosts = m.prop(settings.autoMergePosts === '1');
            this.emailWhenFlagged = m.prop(settings.emailWhenFlagged === '1');
            this.fields.forEach(function (key) {
              return _this2.values[key] = m.prop(settings[key]);
            });
          }
        }, {
          key: "view",
          value: function view() {
            return m(
              "div",
              { className: "WordConfigPage" },
              m(
                "div",
                { className: "container" },
                m(
                  "form",
                  { onsubmit: this.onsubmit.bind(this) },
                  m(
                    "h2",
                    null,
                    app.translator.trans('issyrocks12-filter.admin.title')
                  ),
                  FieldSet.component({
                    label: app.translator.trans('issyrocks12-filter.admin.filter_label'),
                    className: 'WordConfigPage-Settings',
                    children: [m(
                      "div",
                      { className: "WordConfigPage-Settings-input" },
                      m(
                        "div",
                        { className: "helpText" },
                        app.translator.trans('issyrocks12-filter.admin.help')
                      ),
                      m("textarea", { className: "FormControl", placeholder: app.translator.trans('issyrocks12-filter.admin.input.placeholder'), rows: "6", value: this.values.Words() || null, oninput: m.withAttr('value', this.values.Words) })
                    )]
                  }),
                  FieldSet.component({
                    label: app.translator.trans('issyrocks12-filter.admin.input.email_label'),
                    className: 'WordConfigPage-Settings',
                    children: [m(
                      "div",
                      { className: "WordConfigPage-Settings-input" },
                      m(
                        "label",
                        null,
                        app.translator.trans('issyrocks12-filter.admin.input.email_subject')
                      ),
                      m("input", { className: "FormControl", value: this.values.flaggedSubject() || app.translator.trans('issyrocks12-filter.admin.email.default_subject'), oninput: m.withAttr('value', this.values.flaggedSubject) }),
                      m(
                        "label",
                        null,
                        app.translator.trans('issyrocks12-filter.admin.input.email_body')
                      ),
                      m(
                        "div",
                        { className: "helpText" },
                        app.translator.trans('issyrocks12-filter.admin.email_help')
                      ),
                      m("textarea", { className: "FormControl", rows: "4", value: this.values.flaggedEmail() || app.translator.trans('issyrocks12-filter.admin.email.default_text'), oninput: m.withAttr('value', this.values.flaggedEmail) })
                    )]
                  }),
                  Switch.component({
                    state: this.autoMergePosts(),
                    children: app.translator.trans('issyrocks12-filter.admin.input.switch.merge'),
                    className: 'WordConfigPage-Settings-switch',
                    onchange: this.autoMergePosts
                  }),
                  Switch.component({
                    state: this.emailWhenFlagged(),
                    children: app.translator.trans('issyrocks12-filter.admin.input.switch.email'),
                    className: 'WordConfigPage-Settings-switch',
                    onchange: this.emailWhenFlagged
                  }),
                  Button.component({
                    type: 'submit',
                    className: 'Button Button--primary',
                    children: app.translator.trans('core.admin.email.submit_button'),
                    loading: this.loading
                  })
                )
              )
            );
          }
        }, {
          key: "onsubmit",
          value: function onsubmit(e) {
            var _this3 = this;

            // prevent the usual form submit behaviour
            e.preventDefault();

            // if the page is already saving, do nothing
            if (this.loading) return;

            // prevents multiple savings
            this.loading = true;

            var settings = {};

            this.fields.forEach(function (key) {
              return settings[key] = _this3.values[key]();
            });
            // remove previous success popup
            app.alerts.dismiss(this.successAlert);

            saveSettings({
              emailWhenFlagged: this.emailWhenFlagged(),
              autoMergePosts: this.autoMergePosts()
            });

            saveSettings(settings).then(function () {
              // on success, show popup
              app.alerts.show(_this3.successAlert = new Alert({
                type: 'success',
                children: app.translator.trans('core.admin.basics.saved_message')
              }));
            }).catch(function () {}).then(function () {
              // return to the initial state and redraw the page
              _this3.loading = false;
              m.redraw();
            });
          }
        }]);
        return WordConfigPage;
      }(Component);

      _export("default", WordConfigPage);
    }
  };
});;
'use strict';

System.register('issyrocks12/filter/main', ['flarum/app', 'issyrocks12/filter/addWordPane'], function (_export, _context) {
    "use strict";

    var app, addWordPane;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_issyrocks12FilterAddWordPane) {
            addWordPane = _issyrocks12FilterAddWordPane.default;
        }],
        execute: function () {

            app.initializers.add('issyrocks12-filter', function (app) {
                addWordPane();
            });
        }
    };
});