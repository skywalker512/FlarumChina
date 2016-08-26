import { extend } from 'flarum/extend';
import Page from 'sijad/pages/models/Page';
import addPagesPane from 'sijad/pages/addPagesPane';

app.initializers.add('sijad-pages', app => {
  app.store.models.pages = Page;
  addPagesPane();
});
