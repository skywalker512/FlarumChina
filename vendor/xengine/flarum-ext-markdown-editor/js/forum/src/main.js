import {extend} from 'flarum/extend';
import app from 'flarum/app';
import ComposerBody from 'flarum/components/ComposerBody';
import TextEditorPageDown from 'xengine/mdeditor/components/TextEditorPageDown';

app.initializers.add('xengine-mdeditor', () => {
    extend(ComposerBody.prototype, 'init', function init() {
        this.editor = new TextEditorPageDown({
            submitLabel: this.props.submitLabel,
            placeholder: this.props.placeholder,
            onchange: this.content,
            onsubmit: this.onsubmit.bind(this),
            value: this.content()
        })
    });
});
