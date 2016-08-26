import Component from 'flarum/Component';
import ItemList from 'flarum/utils/ItemList';
import listItems from 'flarum/helpers/listItems';

/**
 * The `PageHero` component displays the hero on a page page.
 *
 * ### Props
 *
 * - `page`
 */
export default class PageHero extends Component {
  view() {
    return (
      <header className="Hero PageHero">
        <div className="container">
          <ul className="PageHero-items">{listItems(this.items().toArray())}</ul>
        </div>
      </header>
    );
  }

  /**
   * Build an item list for the contents of the page hero.
   *
   * @return {ItemList}
   */
  items() {
    const items = new ItemList();
    const page = this.props.page;

    items.add('title', (
      <h2 className="PageHero-title">
        <a href={app.route.page(page)} config={m.route}>{page.title()}</a>
      </h2>
    ));

    return items;
  }
}
