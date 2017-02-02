/**
 * This file is part of clarkwinkelmann/flarum-ext-emojionearea
 * See README.md for details and license
 */

import Component from "flarum/Component";
import icon from "flarum/helpers/icon";

export default class EmojiAreaButton extends Component {

    init() {
        this.textEditor = null;
    }

    view() {
        return m('div', {config: this.configArea.bind(this), className: 'Button Button-emojionearea hasIcon Button--icon'}, [
            icon('smile-o', {className: 'Button-icon'}),
            m('span', {className: 'Button-label'}, 'Emojis'), // TODO: translate ?
            m('span', {className: 'Button-emojioneareaContainer'})
        ]);
    }

    configArea(element, isInitialized) {
        if (isInitialized) return;

        var $container = $(element).find('.Button-emojioneareaContainer');
        var editor = this.textEditor;

        $('<div />').emojioneArea({
            container: $container,
            standalone: true, // Popup only mode
            hideSource: false, // Do not hide the target element
            autocomplete: false, // Do not try to provide autocomplete - not sure if useful in standalone mode but safer
            sprite: false, // Not used by the actual picker, but loads an additional CSS file if enabled
            useInternalCDN: false, // Use the same CDN as Flarum so images are not fetched twice
            events: { // Listen for clicks to sync with Flarum editor
                emojibtn_click: function (button, event) {
                    var shortcode = button.data('name');
                    editor.insertAtCursor(shortcode);
                }
            }
        });
    }

}
