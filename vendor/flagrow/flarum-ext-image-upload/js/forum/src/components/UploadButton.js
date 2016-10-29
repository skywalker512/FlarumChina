import Component from 'flarum/Component';
import icon from 'flarum/helpers/icon';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

export default class UploadButton extends Component {

    /**
     * Load the configured remote uploader service.
     */
    init() {
        // the service type handling uploads
        this.textAreaObj = null;

        // initial state of the button
        this.loading = false;
    }

    /**
     * Show the actual Upload Button.
     *
     * @returns {*}
     */
    view() {
        return m('div', {className: 'Button hasIcon flagrow-image-upload-button Button--icon'}, [
            this.loading ? LoadingIndicator.component({className: 'Button-icon'}) : icon('picture-o', {className: 'Button-icon'}),
            m('span', {className: 'Button-label'}, this.loading ? app.translator.trans('flagrow-image-upload.forum.states.loading') : app.translator.trans('flagrow-image-upload.forum.buttons.attach')),
            m('form#flagrow-image-upload-form', [
                m('input', {
                    type: 'file',
                    accept: 'image/*',
                    name: 'flagrow-image-upload-input',
                    onchange: this.process.bind(this)
                })
            ])
        ]);
    }

    /**
     * Process the upload event.
     *
     * @param e
     */
    process(e) {
        // get the file from the input field
        const data = new FormData();
        data.append('image', $(e.target)[0].files[0]);

        // set the button in the loading state (and redraw the element!)
        this.loading = true;
        m.redraw();

        // send a POST request to the api
        app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/image/upload',
            serialize: raw => raw,
            data
        }).then(
            this.success.bind(this),
            this.failure.bind(this)
        );
    }

    /**
     * Handles errors.
     *
     * @param message
     */
    failure(message) {
        // todo show popup
    }

    /**
     * Appends the image's link to the body of the composer.
     *
     * @param image
     */
    success(image) {

        var link = image.data.attributes.url;

        // create a markdown string that holds the image link
        var markdownString = '\n![image ' + link + '](' + link + ')\n';

        // place the Markdown image link in the Composer
        this.textAreaObj.insertAtCursor(markdownString);

        // if we are not starting a new discussion, the variable is defined
        if (typeof this.textAreaObj.props.preview !== 'undefined') {
            // show what we just uploaded
            this.textAreaObj.props.preview();
        }

        // reset the button for a new upload
        setTimeout(() => {
            document.getElementById("flagrow-image-upload-form").reset();
            this.loading = false;
        }, 1000);
    }
}
