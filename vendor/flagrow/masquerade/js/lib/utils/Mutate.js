import Button from "flarum/components/Button";
import icon from "flarum/helpers/icon";

export default class Mutate {
    constructor(validation, content) {
        this.validation = validation || '';
        this.content = content;
    }

    /**
     * Parses the field value.
     */
    parse() {
        if (!this.content || this.content.length == 0) {
            return this.content;
        }

        const type = this.identify();

        if (type) {
            return this[type]();
        }

        return this.content;
    }

    /**
     * Identifies how to parse the field answer.
     * @returns {null|string}
     */
    identify() {
        const validation = this.validation.split(',');
        let identified = null;

        validation.forEach(rule => {
            rule = rule.trim();

            if (this.filtered().indexOf(rule) >= 0) {
                identified = rule;
            }
        })

        return identified;
    }

    /**
     * The validation rules we accept to be parsed differently.
     * @returns {[string,string,string,string,string]}
     */
    filtered() {
        return [
            'url',
            'boolean',
            'email'
        ];
    }

    url() {
        return Button.component({
            onclick: () => this.to(),
            className: 'Button Button--text',
            icon: 'link',
            children: this.content.replace(/^https?:\/\//, '')
        })
    }

    to() {
        var popup = window.open();
        popup.location = this.content;
    }

    boolean() {
        return [1, "1", true, "true", "yes"].indexOf(this.content) === 0 ?
            icon('check-square-o') :
            icon('square-o');
    }

    email() {
        let email = this.content
            .split(/@|\./)
            .map(segment => {
                return segment.replace(/(.{2})./g, '$1*');
            })
            .join('*');

        return Button.component({
            onclick: () => this.mailTo(),
            className: 'Button Button--text',
            icon: 'envelope-o',
            children: email
        })
    }

    mailTo() {
        window.location = 'mailto:' + this.content;
    }
}
