import { extend } from 'flarum/extend';
import TextEditor from 'flarum/components/TextEditor';

import UploadButton from 'flagrow/image-upload/components/UploadButton';

app.initializers.add('flagrow-image-upload', app => {

    /**
     * Add the upload button to the post composer.
     */
    extend(TextEditor.prototype, 'controlItems', function(items)
    {
        // check whether the user can upload images. If not, returns.
        if (!app.forum.attribute('canUploadImages')) return;

        // create and add the button
        var uploadButton = new UploadButton;
        uploadButton.textAreaObj = this;
        items.add('flagrow-image-upload', uploadButton, 0);

        // animate the button on hover: shows the label
        $('.Button-label', '.item-flagrow-image-upload > div').hide();
        $('.item-flagrow-image-upload > div').hover(
                function(){ $('.Button-label', this).show(); $(this).removeClass('Button--icon')},
                function(){ $('.Button-label', this).hide(); $(this).addClass('Button--icon')}
        );
    });
});
