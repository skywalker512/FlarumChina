/**
 * This file is part of clarkwinkelmann/flarum-ext-emojionearea
 * See README.md for details and license
 */

/* global m, $ */

import Component from "flarum/Component";
import icon from "flarum/helpers/icon";

export default class extends Component {

    init() {
        this.textEditor = this.props.textEditor;
    }

    view() {
        return m('.Button.Button-emojionearea.hasIcon.Button--icon', {
            config: this.configArea.bind(this),
        }, [
            icon('smile-o', {className: 'Button-icon'}),
            m('span.Button-label', 'Emojis'), // TODO: translate ?
            m('.Button-emojioneareaContainer'),
        ]);
    }

    configArea(element, isInitialized, context) {
        if (isInitialized) return;

        const $container = $(element).find('.Button-emojioneareaContainer');

        $('<div />').emojioneArea({
            container: $container,
            standalone: true, // Popup only mode
            hideSource: false, // Do not hide the target element
            autocomplete: false, // Do not try to provide autocomplete - not sure if useful in standalone mode but safer
            sprite: false, // Not used by the actual picker, but loads an additional CSS file if enabled
            useInternalCDN: false, // Use the same CDN as Flarum so images are not fetched twice
            buttonTitle: 'Emoji', // The default text includes something with TAB, even for the standalone version where it is useless
            events: { // Listen for clicks to sync with Flarum editor
                emojibtn_click: button => {
                    this.textEditor.insertAtCursor(button.data('name')); // Insert shortcode
                },
            },
        });

        document.addEventListener('click', this.clickedOutside);

        context.onunload = () => {
            document.removeEventListener('click', this.clickedOutside);
        };
    }

    clickedOutside(event) {
        const $target = $(event.target);

        // If we clicked on the popup or its content we don't do anything
        if ($target.is('.Button-emojioneareaContainer') || $target.parents('.Button-emojioneareaContainer').size()) {
            return;
        }

        const $button = $('.Button-emojioneareaContainer .emojionearea-button');

        // If the popup is currently open we close it
        if ($button.is('.active')) {
            $button.trigger('click');
        }
    }

}
