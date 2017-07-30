'use strict';

System.register('Davis/SocialProfile/components/DeleteButtonModal', ['flarum/components/Modal', 'flarum/components/Button'], function (_export, _context) {
  "use strict";

  var Modal, Button, DeleteButtonModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }],
    execute: function () {
      DeleteButtonModal = function (_Modal) {
        babelHelpers.inherits(DeleteButtonModal, _Modal);

        function DeleteButtonModal() {
          babelHelpers.classCallCheck(this, DeleteButtonModal);
          return babelHelpers.possibleConstructorReturn(this, (DeleteButtonModal.__proto__ || Object.getPrototypeOf(DeleteButtonModal)).apply(this, arguments));
        }

        babelHelpers.createClass(DeleteButtonModal, [{
          key: 'init',
          value: function init() {
            var _this2 = this;

            babelHelpers.get(DeleteButtonModal.prototype.__proto__ || Object.getPrototypeOf(DeleteButtonModal.prototype), 'init', this).call(this);

            this.buttons = [];
            this.index = this.props.index;
            var buttons = JSON.parse(this.props.user.data.attributes.socialButtons || '[]');
            this.button = buttons[this.index];

            buttons.forEach(function (button, index) {
              _this2.createButtonObject(index, button);
            });
          }
        }, {
          key: 'className',
          value: function className() {
            return 'SocialButtonsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('davis-socialprofile.forum.edit.deletetitle');
          }
        }, {
          key: 'content',
          value: function content() {
            $('.Modal-content').css('overflow', 'visible');
            return [m('div', { className: 'Modal-body' }, [m('div', { className: 'Form' }, [m('h3', { className: 'SocialProfile-title' }, this.button.title), m('p', { className: 'SocialProfile-url' }, this.button.url), m('div', { className: 'Form-group', id: 'submit-button-group' }, [Button.component({
              type: 'submit',
              className: 'Button Button--primary EditSocialButtons-delete',
              loading: this.loading,
              children: app.translator.trans('davis-socialprofile.forum.edit.delete')
            })])])])];
          }
        }, {
          key: 'data',
          value: function data() {
            var buttons = [];

            this.buttons.forEach(function (button, index) {
              if (button.title() !== '') {
                buttons[index] = {};
                buttons[index].title = button.title();
                buttons[index].url = button.url();
                buttons[index].icon = button.icon();
                buttons[index].favicon = button.favicon();
              }
            });

            return {
              socialButtons: JSON.stringify(buttons)
            };
          }
        }, {
          key: 'onsubmit',
          value: function onsubmit(e) {
            var _this3 = this;

            e.preventDefault();

            this.loading = true;
            this.buttons.splice(this.index, 1);

            this.props.user.save(this.data(), { errorHandler: this.onerror.bind(this) }).then(this.hide.bind(this)).then($('#app').trigger('refreshSocialButtons', [this.data().socialButtons])).catch(function () {
              _this3.loading = false;
              m.redraw();
            });
          }
        }, {
          key: 'createButtonObject',
          value: function createButtonObject(key) {
            var button = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (button == null) {
              this.buttons[key] = {};
              this.buttons[key].index = m.prop(key);
              this.buttons[key].favicon = m.prop('none');
              this.buttons[key].title = m.prop('');
              this.buttons[key].url = m.prop('');
              this.buttons[key].icon = m.prop('globe');
            } else {
              this.buttons[key] = {};
              this.buttons[key].index = m.prop(key);
              this.buttons[key].favicon = m.prop(button.favicon);
              this.buttons[key].title = m.prop(button.title);
              this.buttons[key].url = m.prop(button.url);
              this.buttons[key].icon = m.prop(button.icon);
            }
          }
        }]);
        return DeleteButtonModal;
      }(Modal);

      _export('default', DeleteButtonModal);
    }
  };
});;
'use strict';

System.register('Davis/SocialProfile/components/IconSelectorComponent', ['flarum/components/Dropdown', 'flarum/utils/ItemList', 'flarum/helpers/icon'], function (_export, _context) {
  "use strict";

  var Dropdown, ItemList, icon, IconSelectorComponent;
  return {
    setters: [function (_flarumComponentsDropdown) {
      Dropdown = _flarumComponentsDropdown.default;
    }, function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList.default;
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon.default;
    }],
    execute: function () {
      IconSelectorComponent = function (_Dropdown) {
        babelHelpers.inherits(IconSelectorComponent, _Dropdown);

        function IconSelectorComponent() {
          babelHelpers.classCallCheck(this, IconSelectorComponent);
          return babelHelpers.possibleConstructorReturn(this, (IconSelectorComponent.__proto__ || Object.getPrototypeOf(IconSelectorComponent)).apply(this, arguments));
        }

        babelHelpers.createClass(IconSelectorComponent, [{
          key: 'init',
          value: function init() {
            babelHelpers.get(IconSelectorComponent.prototype.__proto__ || Object.getPrototypeOf(IconSelectorComponent.prototype), 'init', this).call(this);

            this.icons = {
              social: ['fa-globe', 'fa-amazon', 'fa-angellist', 'fa-apple', 'fa-behance', 'fa-bitbucket', 'fa-codepen', 'fa-connectdevelop', 'fa-dashcube', 'fa-delicious', 'fa-deviantart', 'fa-digg', 'fa-dribbble', 'fa-dropbox', 'fa-drupal', 'fa-facebook', 'fa-flickr', 'fa-foursquare', 'fa-get-pocket', 'fa-git', 'fa-github', 'fa-github-alt', 'fa-gittip', 'fa-google', 'fa-google-plus', 'fa-google-wallet', 'fa-gratipay', 'fa-hacker-news', 'fa-instagram', 'fa-ioxhost', 'fa-joomla', 'fa-jsfiddle', 'fa-lastfm', 'fa-leanpub', 'fa-linkedin', 'fa-meanpath', 'fa-medium', 'fa-odnoklassniki', 'fa-opencart', 'fa-pagelines', 'fa-paypal', 'fa-pied-piper-alt', 'fa-pinterest-p', 'fa-qq', 'fa-reddit', 'fa-renren', 'fa-sellsy', 'fa-share-alt', 'fa-shirtsinbulk', 'fa-simplybuilt', 'fa-skyatlas', 'fa-skype', 'fa-slack', 'fa-slideshare', 'fa-soundcloud', 'fa-spotify', 'fa-stack-exchange', 'fa-stack-overflow', 'fa-steam', 'fa-stumbleupon', 'fa-tencent-weibo', 'fa-trello', 'fa-tripadvisor', 'fa-tumblr', 'fa-twitch', 'fa-twitter', 'fa-viacoin', 'fa-vimeo', 'fa-vine', 'fa-vk', 'fa-wechat', 'fa-weibo', 'fa-weixin', 'fa-whatsapp', 'fa-wordpress', 'fa-xing', 'fa-y-combinator', 'fa-yelp', 'fa-youtube-play']
            };
          }
        }, {
          key: 'view',
          value: function view() {
            var _this2 = this;

            $('.iconpicker-image-' + this.props.index()).error(function () {
              _this2.props.favicon('none');
              _this2.props.selection(_this2.icons.social[0]);
              m.redraw();
            });

            this.props.children = this.items().toArray();

            return babelHelpers.get(IconSelectorComponent.prototype.__proto__ || Object.getPrototypeOf(IconSelectorComponent.prototype), 'view', this).call(this);
          }
        }, {
          key: 'getButtonContent',
          value: function getButtonContent() {
            return [/^favicon(-\w+)?$/.test(this.props.selection()) ? [m('img', { className: this.props.selection() === 'favicon-grey' ? 'social-greyscale-button' : 'social-button', style: { width: '14px', height: '14px' }, alt: 'favicon', src: this.props.favicon() })] : icon(this.props.selection().replace('fa-', ''), {}), this.props.caretIcon ? icon(this.props.caretIcon, { className: 'Button-caret' }) : ''];
          }
        }, {
          key: 'items',
          value: function items() {
            var _this3 = this;

            var items = new ItemList();

            if (this.props.favicon() !== 'none') {
              items.add('favicon', m('div', { onclick: function onclick() {
                  _this3.props.selection('favicon');m.redraw();
                }, role: 'button', href: '#', class: 'iconpicker-item ' + (this.props.selection() === 'favicon' ? 'iconpicker--highlighted' : ''), title: 'Favicon' }, [m('img', { className: 'iconpicker-image-' + this.props.index(), alt: 'favicon', style: { width: '14px', height: '14px', margin: '0 2px 0 2px' }, src: this.props.favicon() })]), 102);
              items.add('favicon-grey', m('div', { onclick: function onclick() {
                  _this3.props.selection('favicon-grey');m.redraw();
                }, role: 'button', href: '#', class: 'iconpicker-item-invt ' + (this.props.selection() === 'favicon-grey' ? 'iconpicker--highlighted' : ''), title: 'Grey Favicon' }, [m('img', { className: 'social-greyscale-button iconpicker-image-' + this.props.index(), alt: 'favicon', style: { width: '14px', height: '14px', margin: '0 2px 0 2px' }, src: this.props.favicon() })]), 101);
            }

            this.icons.social.forEach(function (curIcon) {
              var highlighted = m.prop();
              if (_this3.props.selection() === curIcon) {
                highlighted('iconpicker--highlighted');
              }
              items.add(curIcon, m('div', { onclick: function onclick() {
                  _this3.props.selection(curIcon);m.redraw();
                }, role: 'button', href: '#', class: 'iconpicker-item ' + highlighted(), title: '.' + curIcon }, [icon(curIcon.replace('fa-', ''), { className: 'social-icon' })]), 100);
            });

            return items;
          }
        }], [{
          key: 'initProps',
          value: function initProps(props) {
            babelHelpers.get(IconSelectorComponent.__proto__ || Object.getPrototypeOf(IconSelectorComponent), 'initProps', this).call(this, props);

            props.className = 'icondropdown';
            props.buttonClassName = 'Button Button--icon';
            props.menuClassName = 'social-dropdown-menu';
          }
        }]);
        return IconSelectorComponent;
      }(Dropdown);

      _export('default', IconSelectorComponent);
    }
  };
});;
'use strict';

System.register('Davis/SocialProfile/components/SocialButtonsModal', ['flarum/components/Modal', 'flarum/components/Button', 'Davis/SocialProfile/components/WebsiteInputComponent'], function (_export, _context) {
  "use strict";

  var Modal, Button, WebsiteInputComponent, SocialButtonsModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_DavisSocialProfileComponentsWebsiteInputComponent) {
      WebsiteInputComponent = _DavisSocialProfileComponentsWebsiteInputComponent.default;
    }],
    execute: function () {
      SocialButtonsModal = function (_Modal) {
        babelHelpers.inherits(SocialButtonsModal, _Modal);

        function SocialButtonsModal() {
          babelHelpers.classCallCheck(this, SocialButtonsModal);
          return babelHelpers.possibleConstructorReturn(this, (SocialButtonsModal.__proto__ || Object.getPrototypeOf(SocialButtonsModal)).apply(this, arguments));
        }

        babelHelpers.createClass(SocialButtonsModal, [{
          key: 'init',
          value: function init() {
            var _this2 = this;

            babelHelpers.get(SocialButtonsModal.prototype.__proto__ || Object.getPrototypeOf(SocialButtonsModal.prototype), 'init', this).call(this);

            this.buttons = [];
            var buttons = JSON.parse(this.props.user.data.attributes.socialButtons || '[]');

            if (buttons.length) {
              buttons.forEach(function (button, index) {
                if (button.title !== '') {
                  _this2.createButtonObject(index, button);
                }
              });
            } else {
              this.createButtonObject(0);
            }
          }
        }, {
          key: 'className',
          value: function className() {
            return 'SocialButtonsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('davis-socialprofile.forum.edit.headtitle');
          }
        }, {
          key: 'content',
          value: function content() {
            var _this3 = this;

            $('.Modal-content').css('overflow', 'visible');
            return [m('div', { className: 'Modal-body' }, [m('div', { className: 'Form' }, [this.buttons.map(function (button) {
              return WebsiteInputComponent.component({ button: button });
            }), m('div', { className: 'Form-group', id: 'submit-button-group' }, [m('div', {
              className: 'Button Button--primary EditSocialButtons-add',
              style: 'margin-left: 1%;',
              onclick: function onclick() {
                _this3.createButtonObject(_this3.buttons.length);

                m.redraw();
                $('document').ready(function () {
                  $('#socialgroup-' + (_this3.buttons.length - 1)).slideDown();
                });
              }
            }, [m('i', { className: 'fa fa-fw fa-plus' })]), m('div', {
              className: 'Button Button--primary EditSocialButtons-del',
              style: 'margin-left: 1%;',
              onclick: function onclick() {
                var curdel = _this3.buttons.length - 1;
                $('#socialgroup-' + curdel).slideUp('normal', function () {
                  _this3.buttons.splice(curdel, 1);
                  m.redraw();
                });
              }
            }, [m('i', { className: 'fa fa-fw fa-minus' })]), Button.component({
              type: 'submit',
              style: 'float: right;',
              className: 'Button Button--primary EditSocialButtons-save',
              loading: this.loading,
              children: app.translator.trans('davis-socialprofile.forum.edit.submit')
            })])])])];
          }
        }, {
          key: 'data',
          value: function data() {
            var buttons = [];

            this.buttons.forEach(function (button, index) {
              if (button.title() !== '') {
                buttons[index] = {};
                buttons[index].title = button.title();
                buttons[index].url = button.url();
                buttons[index].icon = button.icon();
                buttons[index].favicon = button.favicon();
              }
            });

            return {
              socialButtons: JSON.stringify(buttons)
            };
          }
        }, {
          key: 'onsubmit',
          value: function onsubmit(e) {
            var _this4 = this;

            e.preventDefault();

            this.loading = true;

            this.props.user.save(this.data(), { errorHandler: this.onerror.bind(this) }).then(this.hide.bind(this)).then($('#app').trigger('refreshSocialButtons', [this.data().socialButtons])).catch(function () {
              _this4.loading = false;
              m.redraw();
            });
          }
        }, {
          key: 'createButtonObject',
          value: function createButtonObject(key) {
            var button = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (button == null) {
              this.buttons[key] = {};
              this.buttons[key].index = m.prop(key);
              this.buttons[key].favicon = m.prop('none');
              this.buttons[key].title = m.prop('');
              this.buttons[key].url = m.prop('');
              this.buttons[key].icon = m.prop('globe');
            } else {
              this.buttons[key] = {};
              this.buttons[key].index = m.prop(key);
              this.buttons[key].favicon = m.prop(button.favicon);
              this.buttons[key].title = m.prop(button.title);
              this.buttons[key].url = m.prop(button.url);
              this.buttons[key].icon = m.prop(button.icon);
            }
          }
        }]);
        return SocialButtonsModal;
      }(Modal);

      _export('default', SocialButtonsModal);
    }
  };
});;
'use strict';

System.register('Davis/SocialProfile/components/WebsiteInputComponent', ['flarum/Component', 'Davis/SocialProfile/components/IconSelectorComponent'], function (_export, _context) {
  "use strict";

  var Component, IconSelectorComponent, WebsiteInputComponent;
  return {
    setters: [function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_DavisSocialProfileComponentsIconSelectorComponent) {
      IconSelectorComponent = _DavisSocialProfileComponentsIconSelectorComponent.default;
    }],
    execute: function () {
      WebsiteInputComponent = function (_Component) {
        babelHelpers.inherits(WebsiteInputComponent, _Component);

        function WebsiteInputComponent() {
          babelHelpers.classCallCheck(this, WebsiteInputComponent);
          return babelHelpers.possibleConstructorReturn(this, (WebsiteInputComponent.__proto__ || Object.getPrototypeOf(WebsiteInputComponent)).apply(this, arguments));
        }

        babelHelpers.createClass(WebsiteInputComponent, [{
          key: 'init',
          value: function init() {
            babelHelpers.get(WebsiteInputComponent.prototype.__proto__ || Object.getPrototypeOf(WebsiteInputComponent.prototype), 'init', this).call(this);

            this.button = this.props.button;
          }
        }, {
          key: 'view',
          value: function view() {
            var _this2 = this;

            return m('div', {
              className: 'Form-group form-group-social',
              id: 'socialgroup-' + this.button.index()
            }, [m('input', {
              className: 'SocialFormControl SocialTitle',
              placeholder: app.translator.trans('davis-socialprofile.forum.edit.title'),
              tabIndex: (this.button.index() + 1) * 2 - 1,
              value: this.button.title(),
              onchange: m.withAttr('value', this.button.title)
            }), IconSelectorComponent.component({
              selection: this.button.icon,
              favicon: this.button.favicon,
              index: this.button.index
            }), m('input', {
              className: 'SocialFormControl Socialurl',
              placeholder: app.translator.trans('davis-socialprofile.forum.edit.url'),
              tabIndex: (this.button.index() + 1) * 2,
              value: this.button.url(),
              onchange: m.withAttr('value', function (value) {
                _this2.button.url(value);
                clearTimeout(_this2.waittilfinsihed);
                if (_this2.button.icon() !== 'fa-circle-o-notch fa-spin') {
                  _this2.button.icon('fa-circle-o-notch fa-spin');
                  _this2.button.favicon('none');
                }
                _this2.waittilfinsihed = setTimeout(function () {
                  var urlpattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

                  if (urlpattern.test(_this2.button.url().toLowerCase())) {
                    var iconurl = _this2.button.url().replace(/(:\/\/[^\/]+).*$/, '$1') + '/favicon.ico';
                    _this2.button.favicon(iconurl);
                    _this2.button.icon('favicon');
                    m.redraw();
                  } else {
                    _this2.button.icon('fa-globe');
                    _this2.button.favicon('none');
                    m.redraw();
                  }
                }, 1000);
              })
            }), m('input', {
              className: 'SocialFormControl SocialIcon',
              id: 'icon' + this.button.index(),
              style: { display: 'none' },
              value: this.button.icon(),
              onchange: m.withAttr('value', this.button.icon)
            }), m('input', {
              className: 'SocialFormControl Socialfavicon',
              id: 'favicon' + this.button.index(),
              style: { display: 'none' },
              value: this.button.favicon(),
              onchange: m.withAttr('value', this.button.favicon)
            })]);
          }
        }]);
        return WebsiteInputComponent;
      }(Component);

      _export('default', WebsiteInputComponent);
    }
  };
});;
'use strict';

System.register('Davis/SocialProfile/main', ['flarum/app', 'flarum/Model', 'flarum/models/User', 'flarum/extend', 'flarum/components/UserCard', 'flarum/components/Badge', 'Davis/SocialProfile/components/SocialButtonsModal', 'Davis/SocialProfile/components/DeleteButtonModal'], function (_export, _context) {
  "use strict";

  var app, Model, User, extend, UserCard, Badge, SocialButtonsModal, DeleteButtonModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumModel) {
      Model = _flarumModel.default;
    }, function (_flarumModelsUser) {
      User = _flarumModelsUser.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsUserCard) {
      UserCard = _flarumComponentsUserCard.default;
    }, function (_flarumComponentsBadge) {
      Badge = _flarumComponentsBadge.default;
    }, function (_DavisSocialProfileComponentsSocialButtonsModal) {
      SocialButtonsModal = _DavisSocialProfileComponentsSocialButtonsModal.default;
    }, function (_DavisSocialProfileComponentsDeleteButtonModal) {
      DeleteButtonModal = _DavisSocialProfileComponentsDeleteButtonModal.default;
    }],
    execute: function () {

      app.initializers.add('davis-socialprofile-forum', function () {
        User.prototype.socialButtons = Model.attribute('socialButtons');

        extend(UserCard.prototype, 'init', function () {
          var _this = this;

          $('#app').on('refreshSocialButtons', function (e, buttons) {
            _this.buttons = JSON.parse(buttons || '[]');
            _this.props.user.data.attributes.socialButtons = JSON.parse(buttons || '[]');
            _this.props.user.freshness = new Date();
            m.redraw();
          });
        });

        extend(UserCard.prototype, 'infoItems', function (items) {
          var _this2 = this;

          this.isSelf = app.session.user === this.props.user;
          this.canEdit = app.session.user ? app.session.user.data.attributes.canEdit : false;
          this.buttons = JSON.parse(this.props.user.data.attributes.socialButtons || '[]');

          if (this.buttons.length) {
            this.buttons.forEach(function (button, index) {
              if (button.title !== '' && button.icon !== '' && button.url !== '') {
                var buttonStyle = '';
                var buttonClassName = '';

                if (button.icon === 'favicon' || button.icon === 'favicon-grey') {
                  buttonStyle = 'background-image: url("' + button.favicon + '");background-size: 60%;background-position: 50% 50%;background-repeat: no-repeat;';
                  if (button.icon === 'favicon-grey') {
                    buttonClassName = button.icon + '-' + index + ' social-button social-greyscale-button';
                  } else {
                    buttonClassName = button.icon + '-' + index + ' social-button';
                  }
                } else {
                  buttonStyle = '';
                  buttonClassName = button.icon + '-' + index + ' social-button';
                }
                items.add('' + buttonClassName + (_this2.deleting ? ' social-button--highlightable' : ''), Badge.component({
                  type: 'social social-icon-' + index,
                  icon: button.icon.replace('fa-', ''),
                  label: button.title,
                  style: buttonStyle,
                  onclick: function onclick() {
                    if (_this2.deleting) {
                      app.modal.show(new DeleteButtonModal({ user: _this2.props.user, index: index }));
                    } else {
                      window.open(button.url, '_blank');
                    }
                  }
                }));
              }
            });
            if (this.isSelf) {
              items.add('settings social-button', Badge.component({
                type: 'social social-settings',
                icon: 'cog',
                label: app.translator.trans('davis-socialprofile.forum.edit.edit'),
                onclick: function onclick() {
                  app.modal.show(new SocialButtonsModal({ user: _this2.props.user }));
                }
              }), -1);
            } else if (this.canEdit) {
              items.add('settings social-button', Badge.component({
                type: 'social social-moderate ' + (this.deleting ? 'social-moderate--highlighted' : ''),
                icon: 'exclamation-triangle',
                label: app.translator.trans('davis-socialprofile.forum.edit.delete'),
                onclick: function onclick() {
                  _this2.deleting = !_this2.deleting;
                }
              }), -1);
            }
          } else if (this.isSelf) {
            items.add('settings social-button', Badge.component({
              type: 'social null-social-settings',
              icon: 'plus',
              label: app.translator.trans('davis-socialprofile.forum.edit.add'),
              onclick: function onclick() {
                app.modal.show(new SocialButtonsModal({ user: _this2.props.user }));
              }
            }), -1);
          }
        });
      });
    }
  };
});