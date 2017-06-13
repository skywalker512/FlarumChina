import app from 'flarum/app';
import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import CountriesPage from 'issyrocks12/users-list/components/UsersListPage';

export default function() {
    app.routes.usersList = {path: '/users-list', component: CountriesPage.component()};

    app.extensionSettings['issyrocks12-users-list'] = () => m.route(app.route('usersList'));

    extend(AdminNav.prototype, 'items', items => {
        items.add('users-list', AdminLinkButton.component({
            href: app.route('usersList'),
            icon: 'users',
            children: app.translator.trans('issyrocks12-users-list.admin.nav.users_button'),
            description: app.translator.trans('issyrocks12-users-list.admin.nav.users_text')
        }));
    });
}
