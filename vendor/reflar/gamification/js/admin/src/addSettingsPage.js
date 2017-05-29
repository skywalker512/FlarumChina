import {extend} from "flarum/extend";
import AdminNav from "flarum/components/AdminNav";
import AdminLinkButton from "flarum/components/AdminLinkButton";
import SettingsPage from "Reflar/gamification/components/SettingsPage";

export default function () {
    app.routes['reflar-gamification'] = {path: '/reflar/gamification', component: SettingsPage.component()};

    app.extensionSettings['reflar-gamification'] = () => m.route(app.route('reflar-gamification'));

    extend(AdminNav.prototype, 'items', items => {
        items.add('reflar-gamification', AdminLinkButton.component({
            href: app.route('reflar-gamification'),
            icon: 'thumbs-up',
            children: 'Gamification',
            description: app.translator.trans('reflar-gamification.admin.nav.desc')
        }));
    });
}
