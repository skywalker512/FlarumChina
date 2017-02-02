import listItems from 'flarum/helpers/listItems';
import TextEditor from 'flarum/components/TextEditor';

export default class TextEditorPageDown extends TextEditor {
    init() {
        this.value = m.prop(this.props.value || '');
    }
    view() {
        return (

            <div className="TextEditor">
                <div id="wmd-button-bar"/>
                <textarea className="FormControl Composer-flexible"
                          id="wmd-input"
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
    configTextarea(element, isInitialized) {
        if (isInitialized) return;

        const converter = Markdown.getSanitizingConverter();
        this.PageDown = new Markdown.Editor(converter);
        this.PageDown.run();

        const handler = () => {
            this.onsubmit();
            m.redraw();
        };

        $(element).bind('keydown', 'meta+return', handler);
        $(element).bind('keydown', 'ctrl+return', handler);
    }
}
