/**
 * This file is part of clarkwinkelmann/flarum-ext-emojionearea
 * See README.md for details and license
 */

import app from 'flarum/app';
import {extend} from 'flarum/extend';
import TextEditor from 'flarum/components/TextEditor';
import EmojiAreaButton from 'clarkwinkelmann/emojionearea/components/EmojiAreaButton';

app.initializers.add('clarkwinkelmann-emojionearea', () => {
    extend(TextEditor.prototype, 'controlItems', function (items) {
        const emojiButton = new EmojiAreaButton({
            textEditor: this,
        });

        items.add('clarkwinkelmann-emojionearea', emojiButton, 0);
    });
});
