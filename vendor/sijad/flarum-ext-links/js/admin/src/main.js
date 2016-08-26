import Link from 'sijad/links/models/Link';
import addLinksPane from 'sijad/links/addLinksPane';

app.initializers.add('sijad-links', app => {
  app.store.models.links = Link;
  addLinksPane();
});
