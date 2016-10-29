import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import ImageUploadPage from 'flagrow/image-upload/components/ImageUploadPage';

export default function() {
    // create the route
    app.routes['image-upload'] = {path: '/image-upload', component: ImageUploadPage.component()};

    // bind the route we created to the three dots settings button
    app.extensionSettings['flagrow-image-upload'] = () => m.route(app.route('image-upload'));

    extend(AdminNav.prototype, 'items', items => {
        // add the Image Upload tab to the admin navigation menu
        items.add('image-upload', AdminLinkButton.component({
            href: app.route('image-upload'),
            icon: 'picture-o',
            children: 'Image Upload',
            description: app.translator.trans('flagrow-image-upload.admin.help_texts.description')
        }));
    });
}
