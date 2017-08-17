import ItemList from 'flarum/utils/ItemList';
import listItems from 'flarum/helpers/listItems';
import Button from 'flarum/components/Button';
import Separator from 'flarum/components/Separator';
import TextEditor from 'flarum/components/TextEditor';

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
export default class EnhancedTextEditor extends TextEditor {
  view() {
    return (
      <div className="TextEditor">
        <ul className="TextEditor-controls EnhancedTextEditor-toolbar">
          {listItems(this.toolbarItems().toArray())}
        </ul>
        <textarea className="FormControl Composer-flexible"
          config={this.configTextarea.bind(this)}
          oninput={m.withAttr('value', this.oninput.bind(this))}
          placeholder={this.props.placeholder || ''}
          disabled={!!this.props.disabled}
          value={this.value()}/>

        <ul className="TextEditor-controls Composer-footer">
          {listItems(this.controlItems().toArray())}
        </ul>
      </div>
    );
  }

  /**
   * Configure the textarea element.
   *
   * @param {DOMElement} element
   * @param {Boolean} isInitialized
   */
  configTextarea(element, isInitialized) {
    if (isInitialized) return;

    const handler = () => {
      this.onsubmit();
      m.redraw();
    };

    $(element).bind('keydown', 'meta+return', handler);
    $(element).bind('keydown', 'ctrl+return', handler);
    $(element).bind('keydown', 'ctrl+b', e => {
      this.bold();
      e.preventDefault();
    });
    $(element).bind('keydown', 'ctrl+i', e => {
      this.italic();
      e.preventDefault();
    });
  }

  /**
     * Build an item list for the text editor toolbar.
     *
     * @return {ItemList}
     */
    toolbarItems() {
      const items = new ItemList();

      //Just to left margin, bold button is too near to the avatar image
      items.add('sep0', Separator.component());

      items.add('bold',
        Button.component({
          icon: 'bold',
          title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.bold'),
          className: 'Button',
          onclick: () => this.bold()
        })
      );

      items.add('italic',
        Button.component({
          icon: 'italic',
          className: 'Button',
          title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.italic'),
          onclick: () => this.italic()
        })
      );

      items.add('underline',
        Button.component({
          icon: 'underline',
          className: 'Button',
          title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.underline'),
          onclick: () => this.underline()
        })
      );

      items.add('heading',
        Button.component({
          icon: 'header',
          className: 'Button',
          title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.heading'),
          onclick: () => this.heading()
        })
      );

      items.add('strikethrough',
        Button.component({
          icon: 'strikethrough',
          className: 'Button',
          title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.strikethrough'),
          onclick: () => this.strikethrough()
        })
      );

      items.add('sep1', Separator.component());

      items.add('link',
        Button.component({
          icon: 'link',
          className: 'Button',
          title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.link'),
          onclick: () => this.link()
        })
      );

      items.add('image',
        Button.component({
          icon: 'image',
          className: 'Button',
          title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.image'),
          onclick: () => this.image()
        })
      );

      items.add('quote',
        Button.component({
          icon: 'quote-right',
          className: 'Button',
          title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.quote'),
          onclick: () => this.quote()
        })
      );

      items.add('code',
        Button.component({
          icon: 'code',
          className: 'Button',
          title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.code'),
          onclick: () => this.code()
        })
      );

      items.add('sep2', Separator.component());

      items.add('ordered_list',
        Button.component({
          icon: 'list-ol',
          className: 'Button',
          title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.ordered_list'),
          onclick: () => this.ordered_list()
        })
      );

      items.add('unordered_list',
        Button.component({
          icon: 'list-ul',
          className: 'Button',
          title: app.translator.trans('ganuonglachanh-mdeditor.forum.toolbar.unordered_list'),
          onclick: () => this.unordered_list()
        })
      );

      const symbols = JSON.parse(app.forum.attribute('editorSymbols') || '[]');

      if (symbols.length > 0) {
        items.add('sep', Separator.component());

        for (let i in symbols) {
          const symbol = symbols[i];
          items.add('symbol-' + i,
            Button.component({
              children: symbol.label || symbol.insert,
              className: 'Button',
              onclick: () => this.insertAtCursor(symbol.insert)
            })
          );
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
  insertAroundCursor(before, after) {
    const textarea = this.$('textarea')[0];
    const value = this.value();
    const start = textarea ? textarea.selectionStart : value.length;
    const end = textarea ? textarea.selectionEnd : value.length;

    this.setValue(value.slice(0, start) + before + value.slice(start, end) + after + value.slice(end));

    // Keep the selected text selected
    if (textarea) {
      const newStart = start + before.length;
      const newEnd = end + before.length;
      this.setSelectionRange(newStart, newEnd);
    }
  }

  /**
   * Make selected text bold.
   */
  bold() {
    this.insertAroundCursor('**', '**')
  }

  /**
   * Make selected text italic.
   */
  italic() {
    this.insertAroundCursor('*', '*')
  }

  /**
   * Make selected text underline.
   */
  underline() {
    this.insertAroundCursor('__', '__')
  }

  /**
   * Make selected text strikethrough.
   */
  strikethrough() {
    this.insertAroundCursor('~~', '~~')
  }

  /**
   * Make selected text heading.
   */
  heading() {
    this.insertAroundCursor('# ', '#')
  }

  /**
   * Insert link around selected text.
   */
  link() {
    this.insertAroundCursor('[', '](https://)')
  }

  /**
   * Insert image.
   */
  image() {
    this.insertAroundCursor('![](', ' "")')
  }

  /**
   * Insert quote.
   */
  quote() {
    this.insertAroundCursor('> ', '')
  }

  /**
   * Insert code.
   */
  code() {
    this.insertAroundCursor('```', '```')
  }

  /**
   * Insert ordered_list.
   */
  ordered_list() {
    this.insertAroundCursor('1. ', '')
  }

  /**
   * Insert unordered_list.
   */
  unordered_list() {
    this.insertAroundCursor('* ', '')
  }
}
