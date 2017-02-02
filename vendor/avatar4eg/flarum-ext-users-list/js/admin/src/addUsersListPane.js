import app from 'flarum/app';
import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import CountriesPage from 'avatar4eg/users-list/components/UsersListPage';

export default function() {
    app.routes.usersList = {path: '/users-list', component: CountriesPage.component()};

    app.extensionSettings['avatar4eg-users-list'] = () => m.route(app.route('usersList'));

    extend(AdminNav.prototype, 'items', items => {
        items.add('users-list', AdminLinkButton.component({
            href: app.route('usersList'),
            icon: 'users',
            children: app.translator.trans('avatar4eg-users-list.admin.nav.users_button'),
            description: app.translator.trans('avatar4eg-users-list.admin.nav.users_text')
        }));
    });
}
