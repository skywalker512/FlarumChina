import Component from 'flarum/Component';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import Placeholder from 'flarum/components/Placeholder';
import Button from 'flarum/components/Button';

import PagesListItem from 'sijad/pages/components/PagesListItem';

/**
 * The `PagesList` component displays a list of Pages.
 *
 */
export default class PagesList extends Component {
  init() {
    /**
     * Whether or not pages results are loading.
     *
     * @type {Boolean}
     */
    this.loading = true;

    /**
     * The pages in the pages list.
     *
     * @type {Sijad/Pages/Model/Page[]}
     */
    this.pages = [];

    /**
     * Current page number.
     *
     * @type {Integer}
     */
    this.page = 0;

    /**
     * The number of activity items to load per request.
     *
     * @type {Integer}
     */
    this.loadLimit = 20;

    this.refresh();
  }

  view() {
    if (this.loading) {
      return (
        <div className="PageList-loading">
          {LoadingIndicator.component()}
        </div>
      );
    }

    if (this.pages.length === 0) {
      const text = app.translator.trans('sijad-pages.admin.pages_list.empty_text');
      return Placeholder.component({text})
    }

    let next, prev;

    if(this.nextResults === true) {
      next = Button.component({
        className: 'Button Button--PageList-next',
        icon: 'angle-right',
        onclick: this.loadNext.bind(this)
      });
    }

    if(this.prevResults === true) {
      prev = Button.component({
        className: 'Button Button--PageList-prev',
        icon: 'angle-left',
        onclick: this.loadPrev.bind(this)
      });
    }

    return (
      <div className="PageList">
        <table className="PageList-results">
          <thead>
            <tr>
              <th>{app.translator.trans('sijad-pages.admin.pages_list.title')}</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {this.pages.map(page => {
              return PagesListItem.component({page})
            })}
          </tbody>
        </table>
        <div className="PageList-pagination">
          {next}
          {prev}
        </div>
      </div>
    )
  }

  /**
   * @public
   */
  refresh(clear = true) {
    if (clear) {
      this.loading = true;
      this.pages = [];
    }

    return this.loadResults().then(this.parseResults.bind(this));
  }

  /**
   * Load a new page of Pages results.
   *
   * @param {Integer} page number.
   * @return {Promise}
   */
  loadResults() {
    const offset = this.page * this.loadLimit;
    return app.store.find('pages', {
      page: {offset, limit: this.loadLimit},
      sort: '-time'
    });
  }

  /**
   * Load the next page of results.
   *
   * @public
   */
  loadNext() {
    if(this.nextResults === true) {
      this.page++;
      this.refresh();
    }
  }

  /**
   * Load the previous page of results.
   *
   * @public
   */
  loadPrev() {
    if(this.prevResults === true) {
      this.page--;
      this.refresh();
    }
  }

  /**
   * Parse results and append them to the page list.
   *
   * @param {Page[]} results
   * @return {Page[]}
   */
  parseResults(results) {
    [].push.apply(this.pages, results);

    this.loading = false;

    this.nextResults = !!results.payload.links.next;
    this.prevResults = !!results.payload.links.prev;

    m.lazyRedraw();
    return results;
  }
}
