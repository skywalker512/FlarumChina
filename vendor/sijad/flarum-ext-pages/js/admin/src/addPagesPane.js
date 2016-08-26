import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import PagesPage from 'sijad/pages/components/PagesPage';

export default function() {
  app.routes.pages = {path: '/pages', component: PagesPage.component()};

  app.extensionSettings['sijad-pages'] = () => m.route(app.route('pages'));

  extend(AdminNav.prototype, 'items', items => {
    items.add('pages', AdminLinkButton.component({
      href: app.route('pages'),
      icon: 'file-text-o',
      children: app.translator.trans('sijad-pages.admin.nav.pages_button'),
      description: app.translator.trans('sijad-pages.admin.nav.pages_text')
    }));
  });
}
