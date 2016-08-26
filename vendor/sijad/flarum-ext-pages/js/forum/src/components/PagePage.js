import Page from 'flarum/components/Page';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

import PageHero from 'sijad/pages/components/PageHero';

export default class PagePage extends Page {
  init() {
    super.init();

    /**
     * The page that is being viewed.
     *
     * @type {sijad/pages/model/Page}
     */
    this.page = null;

    this.loadPage();

    app.history.push('page');

    this.bodyClass = 'App--page';
  }

  view() {
    const page = this.page;

    return (
      <div className="Pages">
        <div className="Pages-page">
          {page
            ? [
              PageHero.component({page}),
              <div className="container">
                <div className="Post-body">
                  {m.trust(page.contentHtml())}
                </div>
              </div>
            ]
            : LoadingIndicator.component({className: 'LoadingIndicator--block'})}
        </div>
      </div>
    );
  }

  /**
   *
   * @param {sijad/pages/Page} page
   * @protected
   */
  show(page) {
    this.page = page;

    app.history.push('page', page.title());
    app.setTitle(page.title());

    m.redraw();
  }

  loadPage() {
    this.page = null;

    app.store.find('pages', m.route.param('id').split('-')[0])
        .then(this.show.bind(this));

    m.lazyRedraw();
  }
}
