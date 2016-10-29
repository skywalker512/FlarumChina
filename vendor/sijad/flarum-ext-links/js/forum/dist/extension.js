'use strict';

System.register('sijad/links/components/LinkItem', ['flarum/components/LinkButton'], function (_export, _context) {
  var LinkButton, LinkItem;
  return {
    setters: [function (_flarumComponentsLinkButton) {
      LinkButton = _flarumComponentsLinkButton.default;
    }],
    execute: function () {
      LinkItem = function (_LinkButton) {
        babelHelpers.inherits(LinkItem, _LinkButton);

        function LinkItem() {
          babelHelpers.classCallCheck(this, LinkItem);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(LinkItem).apply(this, arguments));
        }

        babelHelpers.createClass(LinkItem, [{
          key: 'view',
          value: function view() {
            var link = this.props.link;
            return m(
              'a',
              {
                className: 'LinksButton Button Button--link',
                target: link.isNewtab() ? '_blank' : '',
                config: link.isInternal() ? m.route : '',
                href: link.url(),
                title: link.title() },
              link.title()
            );
          }
        }]);
        return LinkItem;
      }(LinkButton);

      _export('default', LinkItem);
    }
  };
});;
'use strict';

System.register('sijad/links/main', ['flarum/extend', 'flarum/app', 'flarum/components/HeaderPrimary', 'sijad/links/models/Link', 'sijad/links/components/LinkItem', 'sijad/links/utils/sortLinks'], function (_export, _context) {
  var extend, app, HeaderPrimary, Link, LinkItem, sortLinks;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponentsHeaderPrimary) {
      HeaderPrimary = _flarumComponentsHeaderPrimary.default;
    }, function (_sijadLinksModelsLink) {
      Link = _sijadLinksModelsLink.default;
    }, function (_sijadLinksComponentsLinkItem) {
      LinkItem = _sijadLinksComponentsLinkItem.default;
    }, function (_sijadLinksUtilsSortLinks) {
      sortLinks = _sijadLinksUtilsSortLinks.default;
    }],
    execute: function () {

      app.initializers.add('sijad-link', function () {
        app.store.models.links = Link;
        extend(HeaderPrimary.prototype, 'items', function (items) {
          var links = app.store.all('links');
          var addLink = function addLink(link) {
            items.add('link' + link.id(), LinkItem.component({ link: link }));
          };
          sortLinks(links).map(addLink);
        });
      });
    }
  };
});;
'use strict';

System.register('sijad/links/models/Link', ['flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed'], function (_export, _context) {
  var Model, mixin, computed, Link;
  return {
    setters: [function (_flarumModel) {
      Model = _flarumModel.default;
    }, function (_flarumUtilsMixin) {
      mixin = _flarumUtilsMixin.default;
    }, function (_flarumUtilsComputed) {
      computed = _flarumUtilsComputed.default;
    }],
    execute: function () {
      Link = function (_mixin) {
        babelHelpers.inherits(Link, _mixin);

        function Link() {
          babelHelpers.classCallCheck(this, Link);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Link).apply(this, arguments));
        }

        return Link;
      }(mixin(Model, {
        title: Model.attribute('title'),
        type: Model.attribute('type'),
        url: Model.attribute('url'),
        position: Model.attribute('position'),
        isInternal: Model.attribute('isInternal'),
        isNewtab: Model.attribute('isNewtab')
      }));

      _export('default', Link);
    }
  };
});;
"use strict";

System.register("sijad/links/utils/sortLinks", [], function (_export, _context) {
  function sortLinks(links) {
    return links.slice(0).sort(function (a, b) {
      var aPos = a.position();
      var bPos = b.position();

      if (bPos === null) return -1;
      if (aPos === null) return 1;

      return a.position() - b.position();
    });
  }

  _export("default", sortLinks);

  return {
    setters: [],
    execute: function () {}
  };
});