import { extend } from 'flarum/extend';
import app from 'flarum/app';
import saveSettings from 'flarum/utils/saveSettings';
import PermissionGrid from 'flarum/components/PermissionGrid';

import addImageUploadPane from 'flagrow/image-upload/addImageUploadPane'

app.initializers.add('flagrow-image-upload', app => {
    // add the admin pane
    addImageUploadPane();

    // add the permission option to the relative pane
    extend(PermissionGrid.prototype, 'startItems', items => {
        items.add('uploadImages', {
            icon: 'picture-o',
            label: app.translator.trans('flagrow-image-upload.admin.permissions.upload_images_label'),
            permission: 'flagrow.image.upload'
        });
    });
});
