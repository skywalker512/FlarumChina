;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.sortable = factory(root.jQuery);
  }
}(this, function($) {
/*
 * HTML5 Sortable jQuery Plugin
 * https://github.com/voidberg/html5sortable
 *
 * Original code copyright 2012 Ali Farhadi.
 * This version is mantained by Alexandru Badiu <andu@ctrlz.ro> & Lukas Oppermann <lukas@vea.re>
 *
 *
 * Released under the MIT license.
 */
'use strict';
/*
 * variables global to the plugin
 */
var dragging;
var draggingHeight;
var placeholders = $();
var sortables = [];
/*
 * remove event handlers from items
 * @param [jquery Collection] items
 * @info event.h5s (jquery way of namespacing events, to bind multiple handlers to the event)
 */
var _removeItemEvents = function(items) {
  items.off('dragstart.h5s');
  items.off('dragend.h5s');
  items.off('selectstart.h5s');
  items.off('dragover.h5s');
  items.off('dragenter.h5s');
  items.off('drop.h5s');
};
/*
 * remove event handlers from sortable
 * @param [jquery Collection] sortable
 * @info event.h5s (jquery way of namespacing events, to bind multiple handlers to the event)
 */
var _removeSortableEvents = function(sortable) {
  sortable.off('dragover.h5s');
  sortable.off('dragenter.h5s');
  sortable.off('drop.h5s');
};
/*
 * attache ghost to dataTransfer object
 * @param [event] original event
 * @param [object] ghost-object with item, x and y coordinates
 */
var _attachGhost = function(event, ghost) {
  // this needs to be set for HTML5 drag & drop to work
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text', '');

  // check if setDragImage method is available
  if (event.dataTransfer.setDragImage) {
    event.dataTransfer.setDragImage(ghost.item, ghost.x, ghost.y);
  }
};
/**
 * _addGhostPos clones the dragged item and adds it as a Ghost item
 * @param [object] event - the event fired when dragstart is triggered
 * @param [object] ghost - .item = node, draggedItem = jQuery collection
 */
var _addGhostPos = function(e, ghost) {
  if (!ghost.x) {
    ghost.x = parseInt(e.pageX - ghost.draggedItem.offset().left);
  }
  if (!ghost.y) {
    ghost.y = parseInt(e.pageY - ghost.draggedItem.offset().top);
  }
  return ghost;
};
/**
 * _makeGhost decides which way to make a ghost and passes it to attachGhost
 * @param [jQuery selection] $draggedItem - the item that the user drags
 */
var _makeGhost = function($draggedItem) {
  return {
    item: $draggedItem[0],
    draggedItem: $draggedItem
  };
};
/**
 * _getGhost constructs ghost and attaches it to dataTransfer
 * @param [event] event - the original drag event object
 * @param [jQuery selection] $draggedItem - the item that the user drags
 * @param [object] ghostOpt - the ghost options
 */
// TODO: could $draggedItem be replaced by event.target in all instances
var _getGhost = function(event, $draggedItem) {
  // add ghost item & draggedItem to ghost object
  var ghost = _makeGhost($draggedItem);
  // attach ghost position
  ghost = _addGhostPos(event, ghost);
  // attach ghost to dataTransfer
  _attachGhost(event, ghost);
};
/*
 * return options if not set on sortable already
 * @param [object] soptions
 * @param [object] options
 */
var _getOptions = function(soptions, options) {
  if (typeof soptions === 'undefined') {
    return options;
  }
  return soptions;
};
/*
 * remove data from sortable
 * @param [jquery Collection] a single sortable
 */
var _removeSortableData = function(sortable) {
  sortable.removeData('opts');
  sortable.removeData('connectWith');
  sortable.removeData('items');
  sortable.removeAttr('aria-dropeffect');
};
/*
 * remove data from items
 * @param [jquery Collection] items
 */
var _removeItemData = function(items) {
  items.removeAttr('aria-grabbed');
  items.removeAttr('draggable');
  items.removeAttr('role');
};
/*
 * check if two lists are connected
 * @param [jquery Collection] items
 */
var _listsConnected = function(curList, destList) {
  if (curList[0] === destList[0]) {
    return true;
  }
  if (curList.data('connectWith') !== undefined) {
    return curList.data('connectWith') === destList.data('connectWith');
  }
  return false;
};
/*
 * destroy the sortable
 * @param [jquery Collection] a single sortable
 */
var _destroySortable = function(sortable) {
  var opts = sortable.data('opts') || {};
  var items = sortable.children(opts.items);
  var handles = opts.handle ? items.find(opts.handle) : items;
  // remove event handlers & data from sortable
  _removeSortableEvents(sortable);
  _removeSortableData(sortable);
  // remove event handlers & data from items
  handles.off('mousedown.h5s');
  _removeItemEvents(items);
  _removeItemData(items);
};
/*
 * enable the sortable
 * @param [jquery Collection] a single sortable
 */
var _enableSortable = function(sortable) {
  var opts = sortable.data('opts');
  var items = sortable.children(opts.items);
  var handles = opts.handle ? items.find(opts.handle) : items;
  sortable.attr('aria-dropeffect', 'move');
  handles.attr('draggable', 'true');
  // IE FIX for ghost
  // can be disabled as it has the side effect that other events
  // (e.g. click) will be ignored
  var spanEl = (document || window.document).createElement('span');
  if (typeof spanEl.dragDrop === 'function' && !opts.disableIEFix) {
    handles.on('mousedown.h5s', function() {
      if (items.index(this) !== -1) {
        this.dragDrop();
      } else {
        $(this).parents(opts.items)[0].dragDrop();
      }
    });
  }
};
/*
 * disable the sortable
 * @param [jquery Collection] a single sortable
 */
var _disableSortable = function(sortable) {
  var opts = sortable.data('opts');
  var items = sortable.children(opts.items);
  var handles = opts.handle ? items.find(opts.handle) : items;
  sortable.attr('aria-dropeffect', 'none');
  handles.attr('draggable', false);
  handles.off('mousedown.h5s');
};
/*
 * reload the sortable
 * @param [jquery Collection] a single sortable
 * @description events need to be removed to not be double bound
 */
var _reloadSortable = function(sortable) {
  var opts = sortable.data('opts');
  var items = sortable.children(opts.items);
  var handles = opts.handle ? items.find(opts.handle) : items;
  // remove event handlers from items
  _removeItemEvents(items);
  handles.off('mousedown.h5s');
  // remove event handlers from sortable
  _removeSortableEvents(sortable);
};
/*
 * public sortable object
 * @param [object|string] options|method
 */
var sortable = function(selector, options) {

  var $sortables = $(selector);
  var method = String(options);

  options = $.extend({
    connectWith: false,
    placeholder: null,
    // dragImage can be null or a jQuery element
    dragImage: null,
    disableIEFix: false,
    placeholderClass: 'sortable-placeholder',
    draggingClass: 'sortable-dragging',
    hoverClass: false
  }, options);

  /* TODO: maxstatements should be 25, fix and remove line below */
  /*jshint maxstatements:false */
  return $sortables.each(function() {

    var $sortable = $(this);

    if (/enable|disable|destroy/.test(method)) {
      sortable[method]($sortable);
      return;
    }

    // get options & set options on sortable
    options = _getOptions($sortable.data('opts'), options);
    $sortable.data('opts', options);
    // reset sortable
    _reloadSortable($sortable);
    // initialize
    var items = $sortable.children(options.items);
    var index;
    var startParent;
    var newParent;
    var placeholder = (options.placeholder === null) ? $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="' + options.placeholderClass + '"/>') : $(options.placeholder).addClass(options.placeholderClass);

    // setup sortable ids
    if (!$sortable.attr('data-sortable-id')) {
      var id = sortables.length;
      sortables[id] = $sortable;
      $sortable.attr('data-sortable-id', id);
      items.attr('data-item-sortable-id', id);
    }

    $sortable.data('items', options.items);
    placeholders = placeholders.add(placeholder);
    if (options.connectWith) {
      $sortable.data('connectWith', options.connectWith);
    }

    _enableSortable($sortable);
    items.attr('role', 'option');
    items.attr('aria-grabbed', 'false');

    // Mouse over class
    if (options.hoverClass) {
      var hoverClass = 'sortable-over';
      if (typeof options.hoverClass === 'string') {
        hoverClass = options.hoverClass;
      }

      items.hover(function() {
        $(this).addClass(hoverClass);
      }, function() {
        $(this).removeClass(hoverClass);
      });
    }

    // Handle drag events on draggable items
    items.on('dragstart.h5s', function(e) {
      e.stopImmediatePropagation();

      if (options.dragImage) {
        _attachGhost(e.originalEvent, {
          item: options.dragImage,
          x: 0,
          y: 0
        });
        console.log('WARNING: dragImage option is deprecated' +
        ' and will be removed in the future!');
      } else {
        // add transparent clone or other ghost to cursor
        _getGhost(e.originalEvent, $(this), options.dragImage);
      }
      // cache selsection & add attr for dragging
      dragging = $(this);
      dragging.addClass(options.draggingClass);
      dragging.attr('aria-grabbed', 'true');
      // grab values
      index = dragging.index();
      draggingHeight = dragging.height();
      startParent = $(this).parent();
      // trigger sortstar update
      dragging.parent().triggerHandler('sortstart', {
        item: dragging,
        placeholder: placeholder,
        startparent: startParent
      });
    });
    // Handle drag events on draggable items
    items.on('dragend.h5s', function() {
      if (!dragging) {
        return;
      }
      // remove dragging attributes and show item
      dragging.removeClass(options.draggingClass);
      dragging.attr('aria-grabbed', 'false');
      dragging.show();

      placeholders.detach();
      newParent = $(this).parent();
      dragging.parent().triggerHandler('sortstop', {
        item: dragging,
        startparent: startParent,
      });
      if (index !== dragging.index() ||
          startParent.get(0) !== newParent.get(0)) {
        dragging.parent().triggerHandler('sortupdate', {
          item: dragging,
          index: newParent.children(newParent.data('items')).index(dragging),
          oldindex: items.index(dragging),
          elementIndex: dragging.index(),
          oldElementIndex: index,
          startparent: startParent,
          endparent: newParent
        });
      }
      dragging = null;
      draggingHeight = null;
    });
    // Handle drop event on sortable & placeholder
    // TODO: REMOVE placeholder?????
    $(this).add([placeholder]).on('drop.h5s', function(e) {
      if (!_listsConnected($sortable, $(dragging).parent())) {
        return;
      }

      e.stopPropagation();
      placeholders.filter(':visible').after(dragging);
      dragging.trigger('dragend.h5s');
      return false;
    });

    // Handle dragover and dragenter events on draggable items
    items.add([this]).on('dragover.h5s dragenter.h5s', function(e) {
      if (!_listsConnected($sortable, $(dragging).parent())) {
        return;
      }

      e.preventDefault();
      e.originalEvent.dataTransfer.dropEffect = 'move';
      if (items.is(this)) {
        var thisHeight = $(this).height();
        if (options.forcePlaceholderSize) {
          placeholder.height(draggingHeight);
        }

        // Check if $(this) is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
        if (thisHeight > draggingHeight) {
          // Dead zone?
          var deadZone = thisHeight - draggingHeight;
          var offsetTop = $(this).offset().top;
          if (placeholder.index() < $(this).index() &&
              e.originalEvent.pageY < offsetTop + deadZone) {
            return false;
          }
          if (placeholder.index() > $(this).index() &&
              e.originalEvent.pageY > offsetTop + thisHeight - deadZone) {
            return false;
          }
        }

        dragging.hide();
        if (placeholder.index() < $(this).index()) {
          $(this).after(placeholder);
        } else {
          $(this).before(placeholder);
        }
        placeholders.not(placeholder).detach();
      } else {
        if (!placeholders.is(this) && !$(this).children(options.items).length) {
          placeholders.detach();
          $(this).append(placeholder);
        }
      }
      return false;
    });
  });
};

sortable.destroy = function(sortable) {
  _destroySortable(sortable);
};

sortable.enable = function(sortable) {
  _enableSortable(sortable);
};

sortable.disable = function(sortable) {
  _disableSortable(sortable);
};

$.fn.sortable = function(options) {
  return sortable(this, options);
};

return sortable;
}));
;
'use strict';

System.register('sijad/links/addLinksPane', ['flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'sijad/links/components/LinksPage'], function (_export, _context) {
  var extend, AdminNav, AdminLinkButton, LinksPage;

  _export('default', function () {
    app.routes.links = { path: '/links', component: LinksPage.component() };

    app.extensionSettings['sijad-links'] = function () {
      return m.route(app.route('links'));
    };

    extend(AdminNav.prototype, 'items', function (items) {
      items.add('links', AdminLinkButton.component({
        href: app.route('links'),
        icon: 'bars',
        children: app.translator.trans('sijad-links.admin.nav.links_button'),
        description: app.translator.trans('sijad-links.admin.nav.links_text')
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
    }, function (_sijadLinksComponentsLinksPage) {
      LinksPage = _sijadLinksComponentsLinksPage.default;
    }],
    execute: function () {}
  };
});;
'use strict';

System.register('sijad/links/components/EditLinkModal', ['flarum/components/Modal', 'flarum/components/Button', 'flarum/utils/string'], function (_export, _context) {
  var Modal, Button, slug, EditlinksModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumUtilsString) {
      slug = _flarumUtilsString.slug;
    }],
    execute: function () {
      EditlinksModal = function (_Modal) {
        babelHelpers.inherits(EditlinksModal, _Modal);

        function EditlinksModal() {
          babelHelpers.classCallCheck(this, EditlinksModal);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(EditlinksModal).apply(this, arguments));
        }

        babelHelpers.createClass(EditlinksModal, [{
          key: 'init',
          value: function init() {
            babelHelpers.get(Object.getPrototypeOf(EditlinksModal.prototype), 'init', this).call(this);

            this.link = this.props.link || app.store.createRecord('links');

            this.itemTitle = m.prop(this.link.title() || '');
            this.url = m.prop(this.link.url() || '');
            this.isInternal = m.prop(this.link.isInternal() && true);
            this.isNewtab = m.prop(this.link.isNewtab() && true);
          }
        }, {
          key: 'className',
          value: function className() {
            return 'EditLinkModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            var title = this.itemTitle();
            return title ? title : app.translator.trans('sijad-links.admin.edit_link.title');
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
                    app.translator.trans('sijad-links.admin.edit_link.title_label')
                  ),
                  m('input', { className: 'FormControl', placeholder: app.translator.trans('sijad-links.admin.edit_link.title_placeholder'), value: this.itemTitle(), oninput: function oninput(e) {
                      _this2.itemTitle(e.target.value);
                    } })
                ),
                m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    'label',
                    null,
                    app.translator.trans('sijad-links.admin.edit_link.url_label')
                  ),
                  m('input', { className: 'FormControl', placeholder: app.translator.trans('sijad-links.admin.edit_link.url_placeholder'), type: 'url', value: this.url(), oninput: function oninput(e) {
                      _this2.url(e.target.value);
                    } })
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
                      m('input', { type: 'checkbox', value: '1', checked: this.isInternal(), onchange: function onchange(e) {
                          if (_this2.isInternal(e.target.checked)) {
                            _this2.isNewtab(false);
                          }
                        } }),
                      app.translator.trans('sijad-links.admin.edit_link.internal_link')
                    ),
                    m(
                      'label',
                      { className: 'checkbox' },
                      m('input', { type: 'checkbox', value: '1', checked: this.isNewtab(), onchange: function onchange(e) {
                          if (_this2.isNewtab(e.target.checked)) {
                            _this2.isInternal(false);
                          }
                        } }),
                      app.translator.trans('sijad-links.admin.edit_link.open_newtab')
                    )
                  )
                ),
                m(
                  'div',
                  { className: 'Form-group' },
                  Button.component({
                    type: 'submit',
                    className: 'Button Button--primary EditLinkModal-save',
                    loading: this.loading,
                    children: app.translator.trans('sijad-links.admin.edit_link.submit_button')
                  }),
                  this.link.exists ? m(
                    'button',
                    { type: 'button', className: 'Button EditLinkModal-delete', onclick: this.delete.bind(this) },
                    app.translator.trans('sijad-links.admin.edit_link.delete_link_button')
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

            this.link.save({
              title: this.itemTitle(),
              url: this.url(),
              isInternal: this.isInternal(),
              isNewtab: this.isNewtab()
            }).then(function () {
              return _this3.hide();
            }, function (response) {
              _this3.loading = false;
              _this3.handleErrors(response);
            });
          }
        }, {
          key: 'delete',
          value: function _delete() {
            if (confirm(app.translator.trans('sijad-links.admin.edit_link.delete_link_confirmation'))) {
              this.link.delete().then(function () {
                return m.redraw();
              });
              this.hide();
            }
          }
        }]);
        return EditlinksModal;
      }(Modal);

      _export('default', EditlinksModal);
    }
  };
});;
'use strict';

System.register('sijad/links/components/LinksPage', ['flarum/components/Page', 'flarum/components/Button', 'sijad/links/components/EditLinkModal', 'sijad/links/utils/sortLinks'], function (_export, _context) {
  var Page, Button, EditLinkModal, sortLinks, LinksPage;


  function LinkItem(link) {
    return m(
      'li',
      { 'data-id': link.id() },
      m(
        'div',
        { className: 'LinkListItem-info' },
        m(
          'span',
          { className: 'LinkListItem-name' },
          link.title()
        ),
        Button.component({
          className: 'Button Button--link',
          icon: 'pencil',
          onclick: function onclick() {
            return app.modal.show(new EditLinkModal({ link: link }));
          }
        })
      )
    );
  }

  return {
    setters: [function (_flarumComponentsPage) {
      Page = _flarumComponentsPage.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_sijadLinksComponentsEditLinkModal) {
      EditLinkModal = _sijadLinksComponentsEditLinkModal.default;
    }, function (_sijadLinksUtilsSortLinks) {
      sortLinks = _sijadLinksUtilsSortLinks.default;
    }],
    execute: function () {
      LinksPage = function (_Page) {
        babelHelpers.inherits(LinksPage, _Page);

        function LinksPage() {
          babelHelpers.classCallCheck(this, LinksPage);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(LinksPage).apply(this, arguments));
        }

        babelHelpers.createClass(LinksPage, [{
          key: 'view',
          value: function view() {
            return m(
              'div',
              { className: 'LinksPage' },
              m(
                'div',
                { className: 'LinksPage-header' },
                m(
                  'div',
                  { className: 'container' },
                  m(
                    'p',
                    null,
                    app.translator.trans('sijad-links.admin.links.about_text')
                  ),
                  Button.component({
                    className: 'Button Button--primary',
                    icon: 'plus',
                    children: app.translator.trans('sijad-links.admin.links.create_button'),
                    onclick: function onclick() {
                      return app.modal.show(new EditLinkModal());
                    }
                  })
                )
              ),
              m(
                'div',
                { className: 'LinksPage-list' },
                m(
                  'div',
                  { className: 'container' },
                  m(
                    'div',
                    { className: 'LinkItems' },
                    m(
                      'label',
                      null,
                      app.translator.trans('sijad-links.admin.links.links')
                    ),
                    m(
                      'ol',
                      { className: 'LinkList' },
                      sortLinks(app.store.all('links')).map(LinkItem)
                    )
                  )
                )
              )
            );
          }
        }, {
          key: 'config',
          value: function config() {
            var _this2 = this;

            this.$('ol').sortable().on('sortupdate', function (e, ui) {
              var order = _this2.$('.LinkList > li').map(function () {
                return {
                  id: $(this).data('id')
                };
              }).get();

              order.forEach(function (link, i) {
                var item = app.store.getById('links', link.id);
                item.pushData({
                  attributes: {
                    position: i
                  }
                });
              });

              app.request({
                url: app.forum.attribute('apiUrl') + '/links/order',
                method: 'POST',
                data: { order: order }
              });

              m.redraw.strategy('all');
              m.redraw();
            });
          }
        }]);
        return LinksPage;
      }(Page);

      _export('default', LinksPage);
    }
  };
});;
'use strict';

System.register('sijad/links/main', ['sijad/links/models/Link', 'sijad/links/addLinksPane'], function (_export, _context) {
  var Link, addLinksPane;
  return {
    setters: [function (_sijadLinksModelsLink) {
      Link = _sijadLinksModelsLink.default;
    }, function (_sijadLinksAddLinksPane) {
      addLinksPane = _sijadLinksAddLinksPane.default;
    }],
    execute: function () {

      app.initializers.add('sijad-links', function (app) {
        app.store.models.links = Link;
        addLinksPane();
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