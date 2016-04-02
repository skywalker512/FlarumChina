System.register('flagrow/image-upload/components/UploadButton', ['flarum/Component', 'flarum/helpers/icon', 'flarum/components/LoadingIndicator'], function (_export) {
    'use strict';

    var Component, icon, LoadingIndicator, UploadButton;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent['default'];
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon['default'];
        }, function (_flarumComponentsLoadingIndicator) {
            LoadingIndicator = _flarumComponentsLoadingIndicator['default'];
        }],
        execute: function () {
            UploadButton = (function (_Component) {
                babelHelpers.inherits(UploadButton, _Component);

                function UploadButton() {
                    babelHelpers.classCallCheck(this, UploadButton);
                    babelHelpers.get(Object.getPrototypeOf(UploadButton.prototype), 'constructor', this).apply(this, arguments);
                }

                babelHelpers.createClass(UploadButton, [{
                    key: 'init',

                    /**
                     * Load the configured remote uploader service.
                     */
                    value: function init() {
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
                }, {
                    key: 'view',
                    value: function view() {
                        return m('div', { className: 'Button hasIcon flagrow-image-upload-button Button--icon' }, [this.loading ? LoadingIndicator.component({ className: 'Button-icon' }) : icon('picture-o', { className: 'Button-icon' }), m('span', { className: 'Button-label' }, this.loading ? app.translator.trans('flagrow-image-upload.forum.states.loading') : app.translator.trans('flagrow-image-upload.forum.buttons.attach')), m('form#flagrow-image-upload-form', [m('input', {
                            type: 'file',
                            accept: 'image/*',
                            name: 'flagrow-image-upload-input',
                            onchange: this.process.bind(this)
                        })])]);
                    }

                    /**
                     * Process the upload event.
                     */
                }, {
                    key: 'process',
                    value: function process(e) {

                        var data = new FormData();
                        data.append('image', $(e.target)[0].files[0]);

                        this.loading = true;
                        m.redraw();

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/image/upload',
                            serialize: function serialize(raw) {
                                return raw;
                            },
                            data: data
                        }).then(this.success.bind(this), this.failure.bind(this));
                    }

                    /**
                     * Handles errors.
                     *
                     * @param message
                     */
                }, {
                    key: 'failure',
                    value: function failure(message) {}
                    // todo show popup

                    /**
                     * Appends the link to the body of the composer.
                     *
                     * @param link
                     */

                }, {
                    key: 'success',
                    value: function success(image) {
                        var _this = this;

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
                        setTimeout(function () {
                            document.getElementById("flagrow-image-upload-form").reset();
                            _this.loading = false;
                        }, 1000);
                    }
                }]);
                return UploadButton;
            })(Component);

            _export('default', UploadButton);
        }
    };
});;
System.register('flagrow/image-upload/main', ['flarum/extend', 'flarum/components/TextEditor', 'flagrow/image-upload/components/UploadButton'], function (_export) {
    'use strict';

    var extend, TextEditor, UploadButton;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsTextEditor) {
            TextEditor = _flarumComponentsTextEditor['default'];
        }, function (_flagrowImageUploadComponentsUploadButton) {
            UploadButton = _flagrowImageUploadComponentsUploadButton['default'];
        }],
        execute: function () {

            app.initializers.add('flagrow-image-upload', function (app) {

                /**
                 * Add the upload button to the post composer.
                 */
                extend(TextEditor.prototype, 'controlItems', function (items) {
                    // check whether the user can upload images. If not, returns.
                    if (!app.forum.attribute('canUploadImages')) return;

                    // create and add the button
                    var uploadButton = new UploadButton();
                    uploadButton.textAreaObj = this;
                    items.add('flagrow-image-upload', uploadButton, 0);

                    // animate the button on hover: shows the label
                    $(".Button-label", ".item-flagrow-image-upload > div").hide();
                    $(".item-flagrow-image-upload > div").hover(function () {
                        $('.Button-label', this).show();$(this).removeClass('Button--icon');
                    }, function () {
                        $('.Button-label', this).hide();$(this).addClass('Button--icon');
                    });
                });
            });
        }
    };
});