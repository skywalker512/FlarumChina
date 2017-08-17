System.register('ganuonglachanh/mdeditor/components/EnhancedTextEditor', ['flarum/utils/ItemList', 'flarum/helpers/listItems', 'flarum/components/Button', 'flarum/components/Separator', 'flarum/components/TextEditor'], function (_export) {

  /**
   * The `EnhancedTextEditor` component displays a textarea with controls, including a
   * submit button.
   *
   * ### Props
   *
   * - `submitLabel`
   * - `value`
   * - `placeholder`
   * - `disabled`
   */
  'use strict';

  var ItemList, listItems, Button, Separator, TextEditor, EnhancedTextEditor;
  return {
    setters: [function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList['default'];
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems['default'];
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton['default'];
    }, function (_flarumComponentsSeparator) {
      Separator = _flarumComponentsSeparator['default'];
    }, function (_flarumComponentsTextEditor) {
      TextEditor = _flarumComponentsTextEditor['default'];
    }],
    execute: function () {
      EnhancedTextEditor = (function (_TextEditor) {
        babelHelpers.inherits(EnhancedTextEditor, _TextEditor);

        function EnhancedTextEditor() {
          babelHelpers.classCallCheck(this, EnhancedTextEditor);
          babelHelpers.get(Object.getPrototypeOf(EnhancedTextEditor.prototype), 'constructor', this).apply(this, arguments);
        }

        babelHelpers.createClass(EnhancedTextEditor, [{
          key: 'view',
          value: function view() {
            return m(
              'div',
              { className: 'TextEditor' },
              m(
                'ul',
                { className: 'TextEditor-controls EnhancedTextEditor-toolbar' },
                listItems(this.toolbarItems().toArray())
              ),
              m('textarea', { className: 'FormControl Composer-flexible',
                config: this.configTextarea.bind(this),
                oninput: m.withAttr('value', this.oninput.bind(this)),
                placeholder: this.props.placeholder || '',
                disabled: !!this.props.disabled,
                value: this.value() }),
              m(
                'ul',
                { className: 'TextEditor-controls Composer-footer' },
                listItems(this.controlItems().toArray())
              )
            );
          }

          /**
           * Configure the textarea element.
           *
           * @param {DOMElement} element
           * @param {Boolean} isInitialized
           */
        }, {
          key: 'configTextarea',
          value: function configTextarea(element, isInitialized) {
            var _this = this;

            if (isInitialized) return;

            var handler = function handler() {
              _this.onsubmit();
              m.redraw();
            };

            $(element).bind('keydown', 'meta+return', handler);
            $(element).bind('keydown', 'ctrl+return', handler);
            $(element).bind('keydown', 'ctrl+b', function (e) {
              _this.bold();
              e.preventDefault();
            });
            $(element).bind('keydown', 'ctrl+i', function (e) {
              _this.italic();
              e.preventDefault();
            });
          }

          /**
             * Build an item list for the text editor toolbar.
             *
             * @return {ItemList}
             */
        }, {
          key: 'toolbarItems',
          value: function toolbarItems() {
            var _this2 = this;

            var items = new ItemList();

            //Just to left margin, bold button is too near to the avatar image
            items.add('sep0', Separator.component());

            items.add('bold', Button.component({
              icon: 'bold',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.bold'),
              className: 'Button',
              onclick: function onclick() {
                return _this2.bold();
              }
            }));

            items.add('italic', Button.component({
              icon: 'italic',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.italic'),
              onclick: function onclick() {
                return _this2.italic();
              }
            }));

            items.add('underline', Button.component({
              icon: 'underline',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.underline'),
              onclick: function onclick() {
                return _this2.underline();
              }
            }));

            items.add('heading', Button.component({
              icon: 'header',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.heading'),
              onclick: function onclick() {
                return _this2.heading();
              }
            }));

            items.add('strikethrough', Button.component({
              icon: 'strikethrough',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.strikethrough'),
              onclick: function onclick() {
                return _this2.strikethrough();
              }
            }));

            items.add('sep1', Separator.component());

            items.add('link', Button.component({
              icon: 'link',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.link'),
              onclick: function onclick() {
                return _this2.link();
              }
            }));

            items.add('image', Button.component({
              icon: 'image',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.image'),
              onclick: function onclick() {
                return _this2.image();
              }
            }));

            items.add('quote', Button.component({
              icon: 'quote-right',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.quote'),
              onclick: function onclick() {
                return _this2.quote();
              }
            }));

            items.add('code', Button.component({
              icon: 'code',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.code'),
              onclick: function onclick() {
                return _this2.code();
              }
            }));

            items.add('sep2', Separator.component());

            items.add('ordered_list', Button.component({
              icon: 'list-ol',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.ordered_list'),
              onclick: function onclick() {
                return _this2.ordered_list();
              }
            }));

            items.add('unordered_list', Button.component({
              icon: 'list-ul',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.unordered_list'),
              onclick: function onclick() {
                return _this2.unordered_list();
              }
            }));

            var symbols = JSON.parse(app.forum.attribute('editorSymbols') || '[]');

            if (symbols.length > 0) {
              items.add('sep', Separator.component());

              var _loop = function (i) {
                var symbol = symbols[i];
                items.add('symbol-' + i, Button.component({
                  children: symbol.label || symbol.insert,
                  className: 'Button',
                  onclick: function onclick() {
                    return _this2.insertAtCursor(symbol.insert);
                  }
                }));
              };

              for (var i in symbols) {
                _loop(i);
              }
            }

            return items;
          }

          /**
           * Insert content into the textarea before and after the position of the cursor.
           *
           * @param {String} before
           * @param {String} after
           */
        }, {
          key: 'insertAroundCursor',
          value: function insertAroundCursor(before, after) {
            var textarea = this.$('textarea')[0];
            var value = this.value();
            var start = textarea ? textarea.selectionStart : value.length;
            var end = textarea ? textarea.selectionEnd : value.length;

            this.setValue(value.slice(0, start) + before + value.slice(start, end) + after + value.slice(end));

            // Keep the selected text selected
            if (textarea) {
              var newStart = start + before.length;
              var newEnd = end + before.length;
              this.setSelectionRange(newStart, newEnd);
            }
          }

          /**
           * Make selected text bold.
           */
        }, {
          key: 'bold',
          value: function bold() {
            this.insertAroundCursor('**', '**');
          }

          /**
           * Make selected text italic.
           */
        }, {
          key: 'italic',
          value: function italic() {
            this.insertAroundCursor('*', '*');
          }

          /**
           * Make selected text underline.
           */
        }, {
          key: 'underline',
          value: function underline() {
            this.insertAroundCursor('__', '__');
          }

          /**
           * Make selected text strikethrough.
           */
        }, {
          key: 'strikethrough',
          value: function strikethrough() {
            this.insertAroundCursor('~~', '~~');
          }

          /**
           * Make selected text heading.
           */
        }, {
          key: 'heading',
          value: function heading() {
            this.insertAroundCursor('# ', '#');
          }

          /**
           * Insert link around selected text.
           */
        }, {
          key: 'link',
          value: function link() {
            this.insertAroundCursor('[', '](https://)');
          }

          /**
           * Insert image.
           */
        }, {
          key: 'image',
          value: function image() {
            this.insertAroundCursor('![](', ' "")');
          }

          /**
           * Insert quote.
           */
        }, {
          key: 'quote',
          value: function quote() {
            this.insertAroundCursor('> ', '');
          }

          /**
           * Insert code.
           */
        }, {
          key: 'code',
          value: function code() {
            this.insertAroundCursor('```', '```');
          }

          /**
           * Insert ordered_list.
           */
        }, {
          key: 'ordered_list',
          value: function ordered_list() {
            this.insertAroundCursor('1. ', '');
          }

          /**
           * Insert unordered_list.
           */
        }, {
          key: 'unordered_list',
          value: function unordered_list() {
            this.insertAroundCursor('* ', '');
          }
        }]);
        return EnhancedTextEditor;
      })(TextEditor);

      _export('default', EnhancedTextEditor);
    }
  };
});;
System.register('ganuonglachanh/mdeditor/main', ['flarum/extend', 'flarum/app', 'flarum/components/ComposerBody', 'ganuonglachanh/mdeditor/components/EnhancedTextEditor'], function (_export) {
    'use strict';

    var extend, app, ComposerBody, EnhancedTextEditor;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp['default'];
        }, function (_flarumComponentsComposerBody) {
            ComposerBody = _flarumComponentsComposerBody['default'];
        }, function (_ganuonglachanhMdeditorComponentsEnhancedTextEditor) {
            EnhancedTextEditor = _ganuonglachanhMdeditorComponentsEnhancedTextEditor['default'];
        }],
        execute: function () {

            app.initializers.add('ganuonglachanh-mdeditor', function () {
                extend(ComposerBody.prototype, 'init', function init() {
                    this.editor = new EnhancedTextEditor({
                        submitLabel: this.props.submitLabel,
                        placeholder: this.props.placeholder,
                        onchange: this.content,
                        onsubmit: this.onsubmit.bind(this),
                        value: this.content()
                    });
                });
            });
        }
    };
});