import { extend } from 'flarum/extend';
import app from 'flarum/app';
import HeaderPrimary from 'flarum/components/HeaderPrimary';

import Link from 'sijad/links/models/Link';
import LinkItem from 'sijad/links/components/LinkItem';
import sortLinks from 'sijad/links/utils/sortLinks';


app.initializers.add('sijad-link', () => {
  app.store.models.links = Link;
  extend(HeaderPrimary.prototype, 'items', function(items) {
    const links = app.store.all('links');
    const addLink = link => {
      items.add('link' + link.id(), LinkItem.component({link}));
    };
    sortLinks(links)
      .map(addLink);
  });
});
