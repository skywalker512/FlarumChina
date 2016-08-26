System.register('vingle/share/social/components/ShareSocialModal', ['flarum/components/Modal', 'flarum/helpers/icon', 'flarum/components/Button'], function (_export) {
  'use strict';

  var Modal, icon, Button, ShareSocialModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal['default'];
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon['default'];
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton['default'];
    }],
    execute: function () {
      ShareSocialModal = (function (_Modal) {
        babelHelpers.inherits(ShareSocialModal, _Modal);

        function ShareSocialModal() {
          babelHelpers.classCallCheck(this, ShareSocialModal);
          babelHelpers.get(Object.getPrototypeOf(ShareSocialModal.prototype), 'constructor', this).apply(this, arguments);
        }

        babelHelpers.createClass(ShareSocialModal, [{
          key: 'init',
          value: function init() {
            babelHelpers.get(Object.getPrototypeOf(ShareSocialModal.prototype), 'init', this).call(this);
          }
        }, {
          key: 'className',
          value: function className() {
            return 'Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.forum.attribute('vingle.share.social') ? app.forum.attribute('vingle.share.social') : '分享';
          }
        }, {
          key: 'content',
          value: function content() {

            return [m(
              'div',
              { className: 'Modal-body' },
              m(
                'div',
                { className: 'Form Form--centered' },
                m(
                  'div',
                  { className: 'Form-group' },
                  Button.component({
                    className: 'Button Button--rounded Share--weibo',
                    icon: 'weibo fa-lg',
                    onclick: function onclick() {
                      var width = 1000;
                      var height = 500;
                      var top = $(window).height() / 2 - height / 2;
                      var left = $(window).width() / 2 - width / 2;
                      window.open('http://service.weibo.com/share/share.php?url=' + encodeURIComponent(app.forum.attribute('baseUrl')) + '/d/' + app.current.discussion.id() + '&title=' + encodeURIComponent(app.title), app.title, 'width=' + width + ', height= ' + height + ', top=' + top + ', left=' + left + ', status=no, scrollbars=no, resizable=no');
                    }
                  }),
                  Button.component({
                    className: 'Button Button--rounded Share--twitter',
                    icon: 'twitter fa-lg',

                    onclick: function onclick() {
                      var width = 1000;
                      var height = 500;
                      var top = $(window).height() / 2 - height / 2;
                      var left = $(window).width() / 2 - width / 2;
                      window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(app.forum.attribute('baseUrl')) + '/d/' + app.current.discussion.id() + '&text=' + encodeURIComponent(app.title), app.title, 'width=' + width + ', height= ' + height + ', top=' + top + ', left=' + left + ', status=no, scrollbars=no, resizable=no');
                    }
                  }),
                  Button.component({
                    className: 'Button Button--rounded Share--facebook',
                    icon: 'facebook fa-lg',
                    onclick: function onclick() {
                      var width = 1000;
                      var height = 500;
                      var top = $(window).height() / 2 - height / 2;
                      var left = $(window).width() / 2 - width / 2;
                      window.open('https://www.facebook.com/sharer.php?=100&p[url]=' + encodeURIComponent(app.forum.attribute('baseUrl')) + '/d/' + app.current.discussion.id() + '&t=' + encodeURIComponent(app.title), app.title, 'width=' + width + ', height= ' + height + ', top=' + top + ', left=' + left + ', status=no, scrollbars=no, resizable=no');
                    }
                  })
                )
              )
            )];
          }
        }]);
        return ShareSocialModal;
      })(Modal);

      _export('default', ShareSocialModal);
    }
  };
});;
System.register('vingle/share/social/main', ['flarum/extend', 'flarum/app', 'flarum/components/DiscussionPage', 'flarum/components/Button', 'vingle/share/social/components/ShareSocialModal'], function (_export) {
  'use strict';

  var extend, app, DiscussionPage, Button, ShareSocialModal;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp['default'];
    }, function (_flarumComponentsDiscussionPage) {
      DiscussionPage = _flarumComponentsDiscussionPage['default'];
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton['default'];
    }, function (_vingleShareSocialComponentsShareSocialModal) {
      ShareSocialModal = _vingleShareSocialComponentsShareSocialModal['default'];
    }],
    execute: function () {

      app.initializers.add('vingle-share-social', function () {
        extend(DiscussionPage.prototype, 'sidebarItems', function (items) {
          items.add('share-social', Button.component({
            className: 'Button Button-icon Button--share',
            icon: 'share-alt',
            children: app.forum.attribute('vingle.share.social') ? app.forum.attribute('vingle.share.social') : 'Share',
            onclick: function onclick() {
              return app.modal.show(new ShareSocialModal());
            }
          }), 5);
        });
      });
    }
  };
});