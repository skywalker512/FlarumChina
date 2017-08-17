System.register('ganuonglachanh/mdeditor/components/EnhancedTextEditor', ['flarum/utils/ItemList', 'flarum/helpers/listItems', 'flarum/components/Button', 'flarum/components/Dropdown', 'flarum/components/Separator', 'flarum/components/TextEditor'], function (_export) {

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

  var ItemList, listItems, Button, Dropdown, Separator, TextEditor, EnhancedTextEditor;
  return {
    setters: [function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList['default'];
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems['default'];
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton['default'];
    }, function (_flarumComponentsDropdown) {
      Dropdown = _flarumComponentsDropdown['default'];
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

            items.add('heading', Dropdown.component({
              icon: 'header',
              className: 'Button',
              children: [ Button.component({className: 'hasIcon', children:'H1', onclick: function onclick() {return _this2.heading();}}), Button.component({className: 'hasIcon', children:'H2', onclick: function onclick() {return _this2.heading2();}}), Button.component({className: 'hasIcon', children:'H3', onclick: function onclick() {return _this2.heading3();}}),],buttonClassName: 'Button Button--link',
            }));

            items.add('strikethrough', Button.component({
              icon: 'strikethrough',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.strikethrough'),
              onclick: function onclick() {
                return _this2.strikethrough();
              }
            }));

            items.add('font', Dropdown.component({
              icon: 'font',
              className: 'Button',
              children: [ Button.component({className: 'hasIcon', children:'S', onclick: function onclick() {return _this2.size1();}}), Button.component({className: 'hasIcon', children:'M', onclick: function onclick() {return _this2.size2();}}), Button.component({className: 'hasIcon', children:'L', onclick: function onclick() {return _this2.size3();}}), Button.component({className: 'hasIcon', children:'XL', onclick: function onclick() {return _this2.size4();}}),],buttonClassName: 'Button Button--link',
            }));

            items.add('tint', Dropdown.component({
              icon: 'tint',
              className: 'Button',
              children: [ Button.component({className: 'hasColor color-t', onclick: function onclick() {return _this2.colort();}}), Button.component({className: 'hasColor color-g', onclick: function onclick() {return _this2.colorg();}}), Button.component({className: 'hasColor color-b', onclick: function onclick() {return _this2.colorb();}}), Button.component({className: 'hasColor color-p', onclick: function onclick() {return _this2.colorp();}}), Button.component({className: 'hasColor color-y', onclick: function onclick() {return _this2.colory();}}), Button.component({className: 'hasColor color-o', onclick: function onclick() {return _this2.coloro();}}), Button.component({className: 'hasColor color-r', onclick: function onclick() {return _this2.colorr();}}),  Button.component({className: 'hasColor color-s', onclick: function onclick() {return _this2.colors();}}),],buttonClassName: 'Button Button--link',
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

            items.add('qrcode', Dropdown.component({
              icon: 'qrcode',
              className: 'Button',
              children: [ Button.component({icon: 'quote-right', className: 'hasIcon', children: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.quote'), onclick: function onclick() {return _this2.quote();}}), Button.component({icon: 'code', className: 'hasIcon', children: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.code'), onclick: function onclick() {return _this2.code();}}), Button.component({icon: 'lightbulb-o', className: 'hasIcon', children: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.high_light'), onclick: function onclick() {return _this2.high_light();}}),],buttonClassName: 'Button Button--link',
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

            items.add('align-left', Dropdown.component({
              icon: 'align-left',
              className: 'Button',
              children: [ Button.component({icon: 'align-center', className: 'hasIcon', children: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.center'), onclick: function onclick() {return _this2.align_center();}}), Button.component({icon: 'align-right', className: 'hasIcon', children: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.right'), onclick: function onclick() {return _this2.align_right();}}),],buttonClassName: 'Button Button--link',
            }));

            items.add('details', Button.component({
              icon: 'eye-slash',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.details'),
              onclick: function onclick() {
                return _this2.details();
              }
            }));

            items.add('reply_see', Button.component({
              icon: 'reply-all',
              className: 'Button',
              title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.reply_see'),
              onclick: function onclick() {
                return _this2.reply_see();
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
            this.insertAroundCursor('[u]', '[/u]');
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

        }, {
          key: 'heading2',
          value: function heading2() {
            this.insertAroundCursor('## ', '##');
          }

        }, {
          key: 'heading3',
          value: function heading3() {
            this.insertAroundCursor('### ', '###');
          }

          /**
           * Font size.
           */
        }, {
          key: 'size1',
          value: function size1() {
            this.insertAroundCursor('[size1]', '[/size1]');
          }

        }, {
          key: 'size2',
          value: function size2() {
            this.insertAroundCursor('[size2]', '[/size2]');
          }

        }, {
          key: 'size3',
          value: function size3() {
            this.insertAroundCursor('[size3]', '[/size3]');
          }

        }, {
          key: 'size4',
          value: function size4() {
            this.insertAroundCursor('[size4]', '[/size4]');
          }

          /**
           * Font Colors.
           */
        }, {
          key: 'colort',
          value: function colort() {
            this.insertAroundCursor('[colort]', '[/colort]');
          }

        }, {
          key: 'colorg',
          value: function colorg() {
            this.insertAroundCursor('[colorg]', '[/colorg]');
          }

        }, {
          key: 'colorb',
          value: function colorb() {
            this.insertAroundCursor('[colorb]', '[/colorb]');
          }

        }, {
          key: 'colorp',
          value: function colorp() {
            this.insertAroundCursor('[colorp]', '[/colorp]');
          }

        }, {
          key: 'colory',
          value: function colory() {
            this.insertAroundCursor('[colory]', '[/colory]');
          }

        }, {
          key: 'coloro',
          value: function coloro() {
            this.insertAroundCursor('[coloro]', '[/coloro]');
          }

        }, {
          key: 'colorr',
          value: function colorr() {
            this.insertAroundCursor('[colorr]', '[/colorr]');
          }

        }, {
          key: 'colors',
          value: function colors() {
            this.insertAroundCursor('[colors]', '[/colors]');
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
            this.insertAroundCursor('![', '](https://)');
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
           * Insert code.
           */
        }, {
          key: 'high_light',
          value: function high_light() {
            this.insertAroundCursor('[hl]', '[/hl]');
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

          /**
           * text align.
           */
        }, {
          key: 'align_center',
          value: function align_center() {
            this.insertAroundCursor('[center] ', '[/center]');
          }

        }, {
          key: 'align_right',
          value: function align_right() {
            this.insertAroundCursor('[right] ', '[/right]');
          }

          /**
           * Insert details.
           */
        }, {
          key: 'details',
          value: function details() {
            this.insertAroundCursor('[details=?] ', '[/details]');
          }

          /**
           * Insert reply_see.
           */
        }, {
          key: 'reply_see',
          value: function reply_see() {
            this.insertAroundCursor('[reply] ', '[/reply]');
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
