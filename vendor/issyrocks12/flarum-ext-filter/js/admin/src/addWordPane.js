import app from 'flarum/app';
import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import WordConfigPage from 'issyrocks12/filter/components/WordConfigPage';

export default function () {
    app.routes['issyrocks12-filter'] = {path: '/filter', component: WordConfigPage.component()};

    app.extensionSettings['issyrocks12-filter'] = () => m.route(app.route('issyrocks12-filter'));

    extend(AdminNav.prototype, 'items', items => {
        items.add('issyrocks12-filter', AdminLinkButton.component({
            href: app.route('issyrocks12-filter'),
            icon: 'filter',
            children: app.translator.trans('issyrocks12-filter.admin.nav.text'),
            description: app.translator.trans('issyrocks12-filter.admin.nav.desc')
        }));
    });
}
