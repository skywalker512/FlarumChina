import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import LinksPage from 'sijad/links/components/LinksPage';

export default function() {
  app.routes.links = {path: '/links', component: LinksPage.component()};

  app.extensionSettings['sijad-links'] = () => m.route(app.route('links'));

  extend(AdminNav.prototype, 'items', items => {
    items.add('links', AdminLinkButton.component({
      href: app.route('links'),
      icon: 'bars',
      children: app.translator.trans('sijad-links.admin.nav.links_button'),
      description: app.translator.trans('sijad-links.admin.nav.links_text')
    }));
  });
}
