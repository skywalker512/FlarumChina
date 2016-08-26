import PagePage from 'sijad/pages/components/PagePage';
import Page from 'sijad/pages/models/Page';

app.initializers.add('sijad-pages', app => {
  app.routes.page = {path: '/p/:id', component: PagePage.component()};
  app.store.models.pages = Page;
  /**
   * Generate a URL to a page.
   *
   * @param {sijad/pages/models/Page} page
   * @return {String}
   */
  app.route.page = page => {
    return app.route('page', {
      id: page.id() + '-' + page.slug()
    });
  };
});
