'use strict';

System.register('sijad/pages/components/PageHero', ['flarum/Component', 'flarum/utils/ItemList', 'flarum/helpers/listItems'], function (_export, _context) {
  var Component, ItemList, listItems, PageHero;
  return {
    setters: [function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList.default;
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems.default;
    }],
    execute: function () {
      PageHero = function (_Component) {
        babelHelpers.inherits(PageHero, _Component);

        function PageHero() {
          babelHelpers.classCallCheck(this, PageHero);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(PageHero).apply(this, arguments));
        }

        babelHelpers.createClass(PageHero, [{
          key: 'view',
          value: function view() {
            return m(
              'header',
              { className: 'Hero PageHero' },
              m(
                'div',
                { className: 'container' },
                m(
                  'ul',
                  { className: 'PageHero-items' },
                  listItems(this.items().toArray())
                )
              )
            );
          }
        }, {
          key: 'items',
          value: function items() {
            var items = new ItemList();
            var page = this.props.page;

            items.add('title', m(
              'h2',
              { className: 'PageHero-title' },
              m(
                'a',
                { href: app.route.page(page), config: m.route },
                page.title()
              )
            ));

            return items;
          }
        }]);
        return PageHero;
      }(Component);

      _export('default', PageHero);
    }
  };
});;
'use strict';

System.register('sijad/pages/components/PagePage', ['flarum/components/Page', 'flarum/components/LoadingIndicator', 'sijad/pages/components/PageHero'], function (_export, _context) {
  var Page, LoadingIndicator, PageHero, PagePage;
  return {
    setters: [function (_flarumComponentsPage) {
      Page = _flarumComponentsPage.default;
    }, function (_flarumComponentsLoadingIndicator) {
      LoadingIndicator = _flarumComponentsLoadingIndicator.default;
    }, function (_sijadPagesComponentsPageHero) {
      PageHero = _sijadPagesComponentsPageHero.default;
    }],
    execute: function () {
      PagePage = function (_Page) {
        babelHelpers.inherits(PagePage, _Page);

        function PagePage() {
          babelHelpers.classCallCheck(this, PagePage);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(PagePage).apply(this, arguments));
        }

        babelHelpers.createClass(PagePage, [{
          key: 'init',
          value: function init() {
            babelHelpers.get(Object.getPrototypeOf(PagePage.prototype), 'init', this).call(this);

            /**
             * The page that is being viewed.
             *
             * @type {sijad/pages/model/Page}
             */
            this.page = null;

            this.loadPage();

            app.history.push('page');

            this.bodyClass = 'App--page';
          }
        }, {
          key: 'view',
          value: function view() {
            var page = this.page;

            return m(
              'div',
              { className: 'Pages' },
              m(
                'div',
                { className: 'Pages-page' },
                page ? [PageHero.component({ page: page }), m(
                  'div',
                  { className: 'container' },
                  m(
                    'div',
                    { className: 'Post-body' },
                    m.trust(page.contentHtml())
                  )
                )] : LoadingIndicator.component({ className: 'LoadingIndicator--block' })
              )
            );
          }
        }, {
          key: 'show',
          value: function show(page) {
            this.page = page;

            app.history.push('page', page.title());
            app.setTitle(page.title());

            m.redraw();
          }
        }, {
          key: 'loadPage',
          value: function loadPage() {
            this.page = null;

            app.store.find('pages', m.route.param('id').split('-')[0]).then(this.show.bind(this));

            m.lazyRedraw();
          }
        }]);
        return PagePage;
      }(Page);

      _export('default', PagePage);
    }
  };
});;
'use strict';

System.register('sijad/pages/main', ['sijad/pages/components/PagePage', 'sijad/pages/models/Page'], function (_export, _context) {
  var PagePage, Page;
  return {
    setters: [function (_sijadPagesComponentsPagePage) {
      PagePage = _sijadPagesComponentsPagePage.default;
    }, function (_sijadPagesModelsPage) {
      Page = _sijadPagesModelsPage.default;
    }],
    execute: function () {

      app.initializers.add('sijad-pages', function (app) {
        app.routes.page = { path: '/p/:id', component: PagePage.component() };
        app.store.models.pages = Page;
        /**
         * Generate a URL to a page.
         *
         * @param {sijad/pages/models/Page} page
         * @return {String}
         */
        app.route.page = function (page) {
          return app.route('page', {
            id: page.id() + '-' + page.slug()
          });
        };
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