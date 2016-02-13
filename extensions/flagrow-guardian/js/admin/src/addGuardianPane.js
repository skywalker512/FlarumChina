import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import GuardianPage from 'hyn/guardian/components/GuardianPage';

export default function() {
  app.routes.guardian = {path: '/guardian', component: GuardianPage.component()};

  app.extensionSettings['hyn-guardian'] = () => m.route(app.route('guardian'));

  extend(AdminNav.prototype, 'items', items => {
    items.add('guardian', AdminLinkButton.component({
      href: app.route('guardian'),
      icon: 'user-secret',
      children: app.translator.trans('hyn-guardian.admin.nav.guardian_button'),
      description: app.translator.trans('hyn-guardian.admin.nav.guardian_text')
    }));
  });
}
