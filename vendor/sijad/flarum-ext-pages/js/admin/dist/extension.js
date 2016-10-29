'use strict';

System.register('sijad/pages/addPagesPane', ['flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'sijad/pages/components/PagesPage'], function (_export, _context) {
  var extend, AdminNav, AdminLinkButton, PagesPage;

  _export('default', function () {
    app.routes.pages = { path: '/pages', component: PagesPage.component() };

    app.extensionSettings['sijad-pages'] = function () {
      return m.route(app.route('pages'));
    };

    extend(AdminNav.prototype, 'items', function (items) {
      items.add('pages', AdminLinkButton.component({
        href: app.route('pages'),
        icon: 'file-text-o',
        children: app.translator.trans('sijad-pages.admin.nav.pages_button'),
        description: app.translator.trans('sijad-pages.admin.nav.pages_text')
      }));
    });
  });

  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsAdminNav) {
      AdminNav = _flarumComponentsAdminNav.default;
    }, function (_flarumComponentsAdminLinkButton) {
      AdminLinkButton = _flarumComponentsAdminLinkButton.default;
    }, function (_sijadPagesComponentsPagesPage) {
      PagesPage = _sijadPagesComponentsPagesPage.default;
    }],
    execute: function () {}
  };
});;
'use strict';

System.register('sijad/pages/components/EditPageModal', ['flarum/components/Modal', 'flarum/components/Button', 'flarum/utils/string'], function (_export, _context) {
  var Modal, Button, slug, EditPageModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumUtilsString) {
      slug = _flarumUtilsString.slug;
    }],
    execute: function () {
      EditPageModal = function (_Modal) {
        babelHelpers.inherits(EditPageModal, _Modal);

        function EditPageModal() {
          babelHelpers.classCallCheck(this, EditPageModal);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(EditPageModal).apply(this, arguments));
        }

        babelHelpers.createClass(EditPageModal, [{
          key: 'init',
          value: function init() {
            babelHelpers.get(Object.getPrototypeOf(EditPageModal.prototype), 'init', this).call(this);

            this.page = this.props.page || app.store.createRecord('pages');

            this.pageTitle = m.prop(this.page.title() || '');
            this.slug = m.prop(this.page.slug() || '');
            this.pageContent = m.prop(this.page.content() || '');
            this.isHidden = m.prop(this.page.isHidden() && true);
            this.isHtml = m.prop(this.page.isHtml() && true);
          }
        }, {
          key: 'className',
          value: function className() {
            return 'EditPageModal Modal--large';
          }
        }, {
          key: 'title',
          value: function title() {
            var title = this.pageTitle();
            return title ? title : app.translator.trans('sijad-pages.admin.edit_page.title');
          }
        }, {
          key: 'content',
          value: function content() {
            var _this2 = this;

            return m(
              'div',
              { className: 'Modal-body' },
              m(
                'div',
                { className: 'Form' },
                m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    'label',
                    null,
                    app.translator.trans('sijad-pages.admin.edit_page.title_label')
                  ),
                  m('input', { className: 'FormControl', placeholder: app.translator.trans('sijad-pages.admin.edit_page.title_placeholder'), value: this.pageTitle(), oninput: function oninput(e) {
                      _this2.pageTitle(e.target.value);
                      _this2.slug(slug(e.target.value));
                    } })
                ),
                m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    'label',
                    null,
                    app.translator.trans('sijad-pages.admin.edit_page.slug_label')
                  ),
                  m('input', { className: 'FormControl', placeholder: app.translator.trans('sijad-pages.admin.edit_page.slug_placeholder'), value: this.slug(), oninput: function oninput(e) {
                      _this2.slug(e.target.value);
                    } })
                ),
                m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    'label',
                    null,
                    app.translator.trans('sijad-pages.admin.edit_page.content_label')
                  ),
                  m('textarea', { className: 'FormControl', rows: '5', value: this.pageContent(), onchange: m.withAttr('value', this.pageContent),
                    placeholder: app.translator.trans('sijad-pages.admin.edit_page.content_placeholder') })
                ),
                m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    'div',
                    null,
                    m(
                      'label',
                      { className: 'checkbox' },
                      m('input', { type: 'checkbox', value: '1', checked: this.isHidden(), onchange: m.withAttr('checked', this.isHidden) }),
                      app.translator.trans('sijad-pages.admin.edit_page.hidden_label')
                    )
                  )
                ),
                m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    'div',
                    null,
                    m(
                      'label',
                      { className: 'checkbox' },
                      m('input', { type: 'checkbox', value: '1', checked: this.isHtml(), onchange: m.withAttr('checked', this.isHtml) }),
                      app.translator.trans('sijad-pages.admin.edit_page.html_label')
                    )
                  )
                ),
                m(
                  'div',
                  { className: 'Form-group' },
                  Button.component({
                    type: 'submit',
                    className: 'Button Button--primary EditPageModal-save',
                    loading: this.loading,
                    children: app.translator.trans('sijad-pages.admin.edit_page.submit_button')
                  }),
                  this.page.exists ? m(
                    'button',
                    { type: 'button', className: 'Button EditPageModal-delete', onclick: this.delete.bind(this) },
                    app.translator.trans('sijad-pages.admin.edit_page.delete_page_button')
                  ) : ''
                )
              )
            );
          }
        }, {
          key: 'onsubmit',
          value: function onsubmit(e) {
            var _this3 = this;

            e.preventDefault();

            this.loading = true;

            this.page.save({
              title: this.pageTitle(),
              slug: this.slug(),
              content: this.pageContent(),
              isHidden: this.isHidden(),
              isHtml: this.isHtml()
            }, { errorHandler: this.onerror.bind(this) }).then(this.hide.bind(this)).catch(function () {
              _this3.loading = false;
              m.redraw();
            });
          }
        }, {
          key: 'onhide',
          value: function onhide() {
            m.route(app.route('pages'));
          }
        }, {
          key: 'delete',
          value: function _delete() {
            if (confirm(app.translator.trans('sijad-pages.admin.edit_page.delete_page_confirmation'))) {
              this.page.delete().then(function () {
                return m.redraw();
              });
              this.hide();
            }
          }
        }]);
        return EditPageModal;
      }(Modal);

      _export('default', EditPageModal);
    }
  };
});;
'use strict';

System.register('sijad/pages/components/PagesList', ['flarum/Component', 'flarum/components/LoadingIndicator', 'flarum/components/Placeholder', 'flarum/components/Button', 'sijad/pages/components/PagesListItem'], function (_export, _context) {
  var Component, LoadingIndicator, Placeholder, Button, PagesListItem, PagesList;
  return {
    setters: [function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumComponentsLoadingIndicator) {
      LoadingIndicator = _flarumComponentsLoadingIndicator.default;
    }, function (_flarumComponentsPlaceholder) {
      Placeholder = _flarumComponentsPlaceholder.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_sijadPagesComponentsPagesListItem) {
      PagesListItem = _sijadPagesComponentsPagesListItem.default;
    }],
    execute: function () {
      PagesList = function (_Component) {
        babelHelpers.inherits(PagesList, _Component);

        function PagesList() {
          babelHelpers.classCallCheck(this, PagesList);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(PagesList).apply(this, arguments));
        }

        babelHelpers.createClass(PagesList, [{
          key: 'init',
          value: function init() {
            /**
             * Whether or not pages results are loading.
             *
             * @type {Boolean}
             */
            this.loading = true;

            /**
             * The pages in the pages list.
             *
             * @type {Sijad/Pages/Model/Page[]}
             */
            this.pages = [];

            /**
             * Current page number.
             *
             * @type {Integer}
             */
            this.page = 0;

            /**
             * The number of activity items to load per request.
             *
             * @type {Integer}
             */
            this.loadLimit = 20;

            this.refresh();
          }
        }, {
          key: 'view',
          value: function view() {
            if (this.loading) {
              return m(
                'div',
                { className: 'PageList-loading' },
                LoadingIndicator.component()
              );
            }

            if (this.pages.length === 0) {
              var text = app.translator.trans('sijad-pages.admin.pages_list.empty_text');
              return Placeholder.component({ text: text });
            }

            var next = void 0,
                prev = void 0;

            if (this.nextResults === true) {
              next = Button.component({
                className: 'Button Button--PageList-next',
                icon: 'angle-right',
                onclick: this.loadNext.bind(this)
              });
            }

            if (this.prevResults === true) {
              prev = Button.component({
                className: 'Button Button--PageList-prev',
                icon: 'angle-left',
                onclick: this.loadPrev.bind(this)
              });
            }

            return m(
              'div',
              { className: 'PageList' },
              m(
                'table',
                { className: 'PageList-results' },
                m(
                  'thead',
                  null,
                  m(
                    'tr',
                    null,
                    m(
                      'th',
                      null,
                      app.translator.trans('sijad-pages.admin.pages_list.title')
                    ),
                    m('th', null)
                  )
                ),
                m(
                  'tbody',
                  null,
                  this.pages.map(function (page) {
                    return PagesListItem.component({ page: page });
                  })
                )
              ),
              m(
                'div',
                { className: 'PageList-pagination' },
                next,
                prev
              )
            );
          }
        }, {
          key: 'refresh',
          value: function refresh() {
            var clear = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            if (clear) {
              this.loading = true;
              this.pages = [];
            }

            return this.loadResults().then(this.parseResults.bind(this));
          }
        }, {
          key: 'loadResults',
          value: function loadResults() {
            var offset = this.page * this.loadLimit;
            return app.store.find('pages', {
              page: { offset: offset, limit: this.loadLimit },
              sort: '-time'
            });
          }
        }, {
          key: 'loadNext',
          value: function loadNext() {
            if (this.nextResults === true) {
              this.page++;
              this.refresh();
            }
          }
        }, {
          key: 'loadPrev',
          value: function loadPrev() {
            if (this.prevResults === true) {
              this.page--;
              this.refresh();
            }
          }
        }, {
          key: 'parseResults',
          value: function parseResults(results) {
            [].push.apply(this.pages, results);

            this.loading = false;

            this.nextResults = !!results.payload.links.next;
            this.prevResults = !!results.payload.links.prev;

            m.lazyRedraw();
            return results;
          }
        }]);
        return PagesList;
      }(Component);

      _export('default', PagesList);
    }
  };
});;
'use strict';

System.register('sijad/pages/components/PagesListItem', ['flarum/Component', 'flarum/components/Button', 'sijad/pages/components/EditPageModal'], function (_export, _context) {
  var Component, Button, EditPageModal, PagesListItem;
  return {
    setters: [function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_sijadPagesComponentsEditPageModal) {
      EditPageModal = _sijadPagesComponentsEditPageModal.default;
    }],
    execute: function () {
      PagesListItem = function (_Component) {
        babelHelpers.inherits(PagesListItem, _Component);

        function PagesListItem() {
          babelHelpers.classCallCheck(this, PagesListItem);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(PagesListItem).apply(this, arguments));
        }

        babelHelpers.createClass(PagesListItem, [{
          key: 'view',
          value: function view() {
            var page = this.props.page;
            var url = app.forum.attribute('baseUrl') + '/p/' + page.id() + '-' + page.slug();
            return m(
              'tr',
              { key: page.id() },
              m(
                'th',
                null,
                page.title()
              ),
              m(
                'td',
                { className: 'Pages-actions' },
                m(
                  'div',
                  { className: 'ButtonGroup' },
                  Button.component({
                    className: 'Button Button--page-edit',
                    icon: 'pencil',
                    onclick: function onclick() {
                      return app.modal.show(new EditPageModal({ page: page }));
                    }
                  }),
                  m(
                    'a',
                    { 'class': 'Button Button--page-view hasIcon', target: '_blank', href: url },
                    m('i', { 'class': 'icon fa fa-fw fa-eye Button-icon' })
                  ),
                  Button.component({
                    className: 'Button Button--danger Button--page-delete',
                    icon: 'times',
                    onclick: this.delete.bind(this)
                  })
                )
              )
            );
          }
        }, {
          key: 'delete',
          value: function _delete() {
            if (confirm(app.translator.trans('sijad-pages.admin.edit_page.delete_page_confirmation'))) {
              var page = this.props.page;
              m.redraw.strategy('all');
              page.delete().then(function () {
                return m.redraw();
              });
            }
          }
        }]);
        return PagesListItem;
      }(Component);

      _export('default', PagesListItem);
    }
  };
});;
'use strict';

System.register('sijad/pages/components/PagesPage', ['flarum/components/Page', 'flarum/components/Button', 'flarum/components/LoadingIndicator', 'sijad/pages/components/EditPageModal', 'sijad/pages/components/PagesList'], function (_export, _context) {
  var Page, Button, LoadingIndicator, EditPageModal, PagesList, PagesPage;
  return {
    setters: [function (_flarumComponentsPage) {
      Page = _flarumComponentsPage.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumComponentsLoadingIndicator) {
      LoadingIndicator = _flarumComponentsLoadingIndicator.default;
    }, function (_sijadPagesComponentsEditPageModal) {
      EditPageModal = _sijadPagesComponentsEditPageModal.default;
    }, function (_sijadPagesComponentsPagesList) {
      PagesList = _sijadPagesComponentsPagesList.default;
    }],
    execute: function () {
      PagesPage = function (_Page) {
        babelHelpers.inherits(PagesPage, _Page);

        function PagesPage() {
          babelHelpers.classCallCheck(this, PagesPage);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(PagesPage).apply(this, arguments));
        }

        babelHelpers.createClass(PagesPage, [{
          key: 'view',
          value: function view() {
            return m(
              'div',
              { className: 'PagesPage' },
              m(
                'div',
                { className: 'PagesPage-header' },
                m(
                  'div',
                  { className: 'container' },
                  m(
                    'p',
                    null,
                    app.translator.trans('sijad-pages.admin.pages.about_text')
                  ),
                  Button.component({
                    className: 'Button Button--primary',
                    icon: 'plus',
                    children: app.translator.trans('sijad-pages.admin.pages.create_button'),
                    onclick: function onclick() {
                      return app.modal.show(new EditPageModal());
                    }
                  })
                )
              ),
              m(
                'div',
                { className: 'PagesPage-list' },
                m(
                  'div',
                  { className: 'container' },
                  PagesList.component()
                )
              )
            );
          }
        }]);
        return PagesPage;
      }(Page);

      _export('default', PagesPage);
    }
  };
});;
'use strict';

System.register('sijad/pages/main', ['flarum/extend', 'sijad/pages/models/Page', 'sijad/pages/addPagesPane'], function (_export, _context) {
  var extend, Page, addPagesPane;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_sijadPagesModelsPage) {
      Page = _sijadPagesModelsPage.default;
    }, function (_sijadPagesAddPagesPane) {
      addPagesPane = _sijadPagesAddPagesPane.default;
    }],
    execute: function () {

      app.initializers.add('sijad-pages', function (app) {
        app.store.models.pages = Page;
        addPagesPane();
      });
    }
  };
});;
'use strict';

System.register('sijad/pages/models/Page', ['flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed', 'flarum/utils/string'], function (_export, _context) {
  var Model, mixin, computed, getPlainContent, Page;
  return {
    setters: [function (_flarumModel) {
      Model = _flarumModel.default;
    }, function (_flarumUtilsMixin) {
      mixin = _flarumUtilsMixin.default;
    }, function (_flarumUtilsComputed) {
      computed = _flarumUtilsComputed.default;
    }, function (_flarumUtilsString) {
      getPlainContent = _flarumUtilsString.getPlainContent;
    }],
    execute: function () {
      Page = function (_mixin) {
        babelHelpers.inherits(Page, _mixin);

        function Page() {
          babelHelpers.classCallCheck(this, Page);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Page).apply(this, arguments));
        }

        return Page;
      }(mixin(Model, {
        title: Model.attribute('title'),
        time: Model.attribute('time', Model.transformDate),
        editTime: Model.attribute('editTime', Model.transformDate),
        content: Model.attribute('content'),
        contentHtml: Model.attribute('contentHtml'),
        contentPlain: computed('contentHtml', getPlainContent),
        slug: Model.attribute('slug'),
        isHidden: Model.attribute('isHidden'),
        isHtml: Model.attribute('isHtml')
      }));

      _export('default', Page);
    }
  };
});